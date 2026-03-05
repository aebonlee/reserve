# 강의 요청 게시판 — 설계 문서

## 1. 배경 및 목적

외부 강의 의뢰인(기업, 기관 등)이 **로그인 없이** 원하는 강의 주제와 희망 일정을 요청할 수 있는 게시판을 제공한다. 관리자가 요청을 검토하여 승인하면 **자동으로 스케줄(일정)이 생성**되어 예약 가능한 상태가 된다.

---

## 2. 사용자 역할

| 역할 | 설명 | 인증 필요 |
|------|------|----------|
| **외부 의뢰인** | 강의를 요청하는 사람 | 아니오 (비로그인) |
| **관리자** | 요청을 검토, 승인/반려하는 사람 | 예 (AdminGuard) |
| **일반 방문자** | 요청 목록을 조회하는 사람 | 아니오 |

---

## 3. 상태 흐름 (Status Flow)

```
[요청 제출]
     │
     ▼
  ┌─────────┐
  │ pending │ ← 초기 상태
  └────┬────┘
       │
  ┌────┴────┐
  │         │
  ▼         ▼
┌────────┐ ┌──────────┐
│approved│ │ rejected │
└────┬───┘ └──────────┘
     │
     ▼
 schedules 테이블에
 일정 자동 생성
```

### 상태 정의

| 상태 | 한국어 | 설명 |
|------|--------|------|
| `pending` | 대기중 | 제출 직후, 관리자 검토 전 |
| `approved` | 승인됨 | 관리자가 승인, 일정 자동 생성됨 |
| `rejected` | 반려됨 | 관리자가 사유와 함께 반려 |

---

## 4. 데이터 모델

### lecture_requests 테이블

```
┌─────────────────────────────────────────────────┐
│                lecture_requests                  │
├─────────────────────┬───────────────────────────┤
│ id                  │ UUID (PK, auto)           │
│ requester_name      │ TEXT (NOT NULL)            │
│ requester_email     │ TEXT (NOT NULL)            │
│ requester_phone     │ TEXT (nullable)            │
│ requester_organization │ TEXT (nullable)         │
│ title               │ TEXT (NOT NULL)            │
│ description         │ TEXT (nullable)            │
│ category            │ TEXT (nullable)            │
│ preferred_dates     │ TEXT[] (nullable)          │
│ date_range_start    │ DATE (nullable)            │
│ date_range_end      │ DATE (nullable)            │
│ date_notes          │ TEXT (nullable)            │
│ preferred_start_time│ TIME (nullable)            │
│ preferred_end_time  │ TIME (nullable)            │
│ preferred_location  │ TEXT (nullable)            │
│ expected_participants│ INTEGER (nullable)        │
│ status              │ TEXT (pending/approved/rejected) │
│ admin_notes         │ TEXT (nullable)            │
│ reviewed_by         │ UUID → auth.users (nullable)│
│ reviewed_at         │ TIMESTAMPTZ (nullable)     │
│ created_schedule_id │ UUID (nullable)            │
│ created_at          │ TIMESTAMPTZ (auto)         │
│ updated_at          │ TIMESTAMPTZ (auto)         │
└─────────────────────┴───────────────────────────┘
```

### 관계

- `reviewed_by` → `auth.users(id)` : 검토한 관리자
- `created_schedule_id` → `schedules(id)` : 승인 시 생성된 일정 (논리적 FK)

---

## 5. RLS (Row Level Security) 정책

| 정책 | 대상 | 조건 |
|------|------|------|
| SELECT | 누구나 | `USING (true)` |
| INSERT | 누구나 | `WITH CHECK (true)` — 비로그인 제출 허용 |
| UPDATE | 인증된 사용자만 | `USING (auth.role() = 'authenticated')` |
| DELETE | 인증된 사용자만 | `USING (auth.role() = 'authenticated')` |

---

## 6. UI 구성

### 6.1 외부 의뢰인 화면

**목록 페이지** (`/lecture-request`)
- 상태별 필터 (전체/대기중/승인됨/반려됨)
- 카드 그리드 형태
- "강의 요청하기" 버튼 → 제출 페이지로

**제출 페이지** (`/lecture-request/new`)
- 3개 섹션으로 구분된 폼:
  1. 요청자 정보 (이름*, 이메일*, 전화번호, 소속)
  2. 강의 정보 (제목*, 설명, 카테고리, 예상 인원)
  3. 희망 일정 (캘린더 복수 선택, 날짜 범위, 메모, 시간, 장소)
- 제출 성공 시 성공 화면 표시

### 6.2 관리자 화면

**관리 페이지** (`/admin/lecture-requests`)
- 통계 카드 (전체/대기중/승인/반려)
- 검색 + 상태 필터
- 테이블 형태 목록 (클릭 시 행 확장)
- 확장된 행에서 전체 정보 확인
- **승인**: ScheduleForm 모달 (요청 데이터 pre-fill) → 제출 시 일정 자동 생성
- **반려**: 사유 입력 모달

---

## 7. 승인 프로세스 상세

1. 관리자가 pending 요청의 "승인" 버튼 클릭
2. 모달에 `ScheduleForm`이 열림 (요청 데이터로 pre-fill)
   - `title` ← `request.title`
   - `description` ← `request.description`
   - `date` ← `request.preferred_dates[0]` 또는 `request.date_range_start`
   - `start_time` ← `request.preferred_start_time`
   - `end_time` ← `request.preferred_end_time`
   - `location` ← `request.preferred_location`
   - `capacity` ← `request.expected_participants`
   - `category` ← `request.category`
   - `status` ← `'open'`
3. 관리자가 필요에 따라 수정 후 제출
4. `scheduleService.createSchedule()` 호출 → `schedules` 테이블에 생성
5. `lecture_requests` 상태 → `approved`, `created_schedule_id` 연결
6. 목록 새로고침

---

## 8. 기존 시스템 통합 포인트

| 통합 대상 | 변경 내용 |
|----------|----------|
| `site.js` | menuItems, footerLinks에 메뉴 추가 |
| `PublicLayout.jsx` | lazy import 3개 + Route 3개 추가 |
| `AdminDashboard.jsx` | 대기중 요청 StatsCard + 바로가기 링크 |
| `translations.js` | `nav.lectureRequest` + `lectureRequest.*` 번역 키 (ko/en) |
| `index.css` | `lectureRequest.css` import |
| `ScheduleForm.jsx` | 재사용 (승인 모달에서 import) |
| `scheduleService.js` | `createSchedule()` 재사용 (승인 시 호출) |
