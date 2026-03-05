# 강의 요청 게시판 — 구현 계획서

## 1. 구현 범위

외부 강의 의뢰인이 **비로그인**으로 강의 요청(주제, 내용, 희망 일자)을 제출할 수 있는 게시판을 추가한다. 관리자가 요청을 승인하면 **자동으로 스케줄(일정)이 생성**된다.

---

## 2. 파일 생성/수정 목록

### 2.1 새로 생성한 파일 (9개)

| # | 파일 경로 | 역할 |
|---|----------|------|
| 1 | `supabase/lecture_requests.sql` | DB 테이블 + RLS + 인덱스 생성 SQL |
| 2 | `src/utils/lectureRequestService.js` | CRUD + 승인/반려 서비스 레이어 |
| 3 | `src/styles/lectureRequest.css` | 전체 스타일 (다크모드/반응형 포함) |
| 4 | `src/components/lectureRequest/DatePicker.jsx` | 복수 날짜 선택 캘린더 |
| 5 | `src/components/lectureRequest/LectureRequestForm.jsx` | 요청 제출 폼 |
| 6 | `src/components/lectureRequest/LectureRequestCard.jsx` | 요청 목록 카드 |
| 7 | `src/pages/LectureRequest.jsx` | 게시판 목록 페이지 |
| 8 | `src/pages/LectureRequestSubmit.jsx` | 요청 제출 페이지 |
| 9 | `src/pages/admin/LectureRequestManage.jsx` | 관리자 요청 관리 페이지 |

### 2.2 수정한 기존 파일 (5개)

| # | 파일 경로 | 변경 내용 |
|---|----------|----------|
| 1 | `src/index.css` | `@import './styles/lectureRequest.css'` 추가 |
| 2 | `src/config/site.js` | menuItems, footerLinks에 강의 요청 메뉴 추가 |
| 3 | `src/layouts/PublicLayout.jsx` | lazy import 3개 + Route 3개 추가 |
| 4 | `src/pages/admin/AdminDashboard.jsx` | 강의 요청 통계 카드 + 바로가기 링크 추가 |
| 5 | `src/utils/translations.js` | `nav.lectureRequest` + `lectureRequest.*` 번역 키 (ko/en) |

---

## 3. 구현 순서 (실제 수행 순서)

```
Step 1.  SQL 스크립트 작성           → supabase/lecture_requests.sql
Step 2.  서비스 레이어 작성          → lectureRequestService.js
Step 3.  스타일 작성                → lectureRequest.css
Step 4.  번역 키 추가               → translations.js (ko/en 양쪽)
Step 5.  CSS import 추가            → index.css
Step 6.  DatePicker 컴포넌트        → components/lectureRequest/DatePicker.jsx
Step 7.  Form 컴포넌트              → components/lectureRequest/LectureRequestForm.jsx
Step 8.  Card 컴포넌트              → components/lectureRequest/LectureRequestCard.jsx
Step 9.  제출 페이지                → pages/LectureRequestSubmit.jsx
Step 10. 목록 페이지                → pages/LectureRequest.jsx
Step 11. 메뉴 추가                  → config/site.js
Step 12. 라우트 추가                → layouts/PublicLayout.jsx
Step 13. 관리자 페이지              → pages/admin/LectureRequestManage.jsx
Step 14. 대시보드 통계 추가          → pages/admin/AdminDashboard.jsx
Step 15. 빌드 검증                  → npm run build ✅ 성공
```

---

## 4. 설계 결정 사항

### 4.1 기존 패턴 재사용

| 참고 대상 | 활용 방식 |
|----------|----------|
| `ScheduleForm.jsx` | 승인 모달에서 직접 import하여 재사용 (pre-fill) |
| `ScheduleCard.jsx` | `LectureRequestCard.jsx`의 레이아웃 패턴 참고 |
| `CalendarView.jsx` | `DatePicker.jsx`의 캘린더 렌더링 로직 참고 |
| `scheduleService.js` | `lectureRequestService.js`의 Supabase 호출 패턴 참고 |
| `schedule.css` | `lectureRequest.css`의 CSS 변수/클래스 네이밍 참고 |

### 4.2 CSS 클래스 네이밍

기존 `schedule-*` 패턴과 충돌을 피하기 위해 `lr-*` 접두사 사용:
- `lr-card`, `lr-form`, `lr-status`, `lr-grid`, `lr-toolbar` 등

### 4.3 비로그인 제출 허용

- Supabase RLS에서 `INSERT`에 `WITH CHECK (true)` 설정
- 프론트엔드에서 AuthGuard 미적용 (`/lecture-request/*` 라우트)
- `UPDATE`/`DELETE`는 인증된 사용자(관리자)만 가능

### 4.4 승인 시 자동 일정 생성

- `approveLectureRequest()` 함수가 `createSchedule()` 호출 후 상태 업데이트
- 트랜잭션이 아닌 순차 호출 (Supabase JS SDK 제약)
- 일정 생성 실패 시 상태가 업데이트되지 않음 (안전)

---

## 5. 검증 체크리스트

- [x] `npm run build` 성공 (에러/경고 없음)
- [ ] 비로그인 상태에서 `/lecture-request/new` 접근 → 폼 제출 가능
- [ ] 관리자 로그인 → `/admin/lecture-requests` 접근 → 요청 목록 확인
- [ ] 승인 시 `schedules` 테이블에 일정 생성
- [ ] 반려 시 상태 변경 + 사유 저장
- [ ] 다크모드 정상 표시
- [ ] 모바일 반응형 정상
- [ ] 한/영 전환 정상
- [ ] Supabase SQL 스크립트 실행 필요 (수동)
