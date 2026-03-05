# 강의 요청 기능 — 사용 및 개발 가이드

## 1. 배포 전 준비 (필수)

### 1.1 Supabase 테이블 생성

1. Supabase 대시보드 접속
2. **SQL Editor** 메뉴 클릭
3. `supabase/lecture_requests.sql` 파일 내용을 붙여넣기
4. **Run** 실행
5. Table Editor에서 `lecture_requests` 테이블 생성 확인

```
파일 위치: D:\reserve\supabase\lecture_requests.sql
```

### 1.2 빌드 & 배포

```bash
npm run build    # dist/ 폴더 생성
# GitHub Pages로 자동 배포 (기존 CI/CD 파이프라인 사용)
```

---

## 2. 사용자 가이드

### 2.1 외부 의뢰인 (강의 요청자)

#### 요청 제출하기

1. 상단 메뉴에서 **"강의요청"** 클릭
2. **"강의 요청하기"** 버튼 클릭 또는 직접 `/lecture-request/new` 접속
3. 폼을 작성합니다:

   **필수 항목:**
   - 이름
   - 이메일
   - 강의 제목

   **선택 항목:**
   - 전화번호, 소속
   - 강의 내용 설명, 카테고리
   - 희망 날짜 (캘린더에서 복수 선택 가능)
   - 희망 기간 (시작일 ~ 종료일)
   - 날짜 관련 메모 (예: "평일 오후 선호")
   - 희망 시간 (시작~종료)
   - 희망 장소
   - 예상 참가 인원

4. **"요청 제출"** 버튼 클릭
5. 성공 화면 표시 → "새 요청하기" 또는 "목록으로" 이동

#### 요청 목록 보기

- `/lecture-request` 에서 전체 요청 목록 확인
- 상태별 필터: 전체 / 대기중 / 승인됨 / 반려됨

---

### 2.2 관리자

#### 요청 관리 페이지 접속

1. 관리자 계정으로 로그인
2. 방법 A: 상단 메뉴 → **관리자** → 대시보드의 **"강의 요청 관리"** 링크
3. 방법 B: 직접 `/admin/lecture-requests` 접속

#### 요청 검토

1. 테이블에서 요청 행 클릭 → 상세 정보 확장
2. 요청자 정보, 강의 정보, 희망 일정 등 전체 확인

#### 승인하기

1. 상세 정보에서 **"승인"** 버튼 클릭
2. 일정 생성 모달이 열림 (요청 데이터가 자동으로 채워짐)
3. 필요에 따라 날짜, 시간, 장소, 정원 등 수정
4. **"생성"** 버튼 클릭
5. `schedules` 테이블에 일정이 자동 생성됨
6. 요청 상태가 `approved`로 변경됨

#### 반려하기

1. 상세 정보에서 **"반려"** 버튼 클릭
2. 반려 사유 입력
3. **"반려"** 버튼 클릭
4. 요청 상태가 `rejected`로 변경됨

#### 삭제하기

1. 상세 정보에서 **"삭제"** 버튼 클릭
2. 확인 대화상자에서 승인
3. 요청이 영구 삭제됨

---

## 3. 개발 가이드

### 3.1 새 필드 추가하기

1. `supabase/lecture_requests.sql`에 컬럼 추가 (ALTER TABLE)
2. `lectureRequestService.js`의 `submitLectureRequest()`에 필드 매핑 추가
3. `LectureRequestForm.jsx`에 입력 필드 추가
4. `LectureRequestManage.jsx`의 `TableRow` 상세 영역에 표시 추가
5. `translations.js`에 번역 키 추가 (ko/en)

### 3.2 새 상태 추가하기

1. SQL의 CHECK 제약 수정: `CHECK (status IN ('pending', 'approved', 'rejected', 'new_status'))`
2. `lectureRequestService.js`에 상태 변경 함수 추가
3. `translations.js`에 번역 키 추가
4. CSS에 `.lr-status.status-new_status` 스타일 추가 (light/dark 모두)
5. 필터 버튼에 새 상태 추가 (`LectureRequest.jsx`, `LectureRequestManage.jsx`)

### 3.3 이메일 알림 추가하기 (향후 확장)

Supabase Edge Functions 또는 Database Webhooks를 사용:

```
1. lecture_requests INSERT 시 → 관리자에게 새 요청 알림
2. status UPDATE 시 → 요청자에게 결과 알림 (approved/rejected)
```

### 3.4 CSS 클래스 네이밍 규칙

- 접두사: `lr-` (lecture request)
- 예시: `lr-card`, `lr-form`, `lr-status`, `lr-grid`, `lr-toolbar`
- 상태 클래스: `status-pending`, `status-approved`, `status-rejected`
- 기존 `schedule-*` 클래스와 충돌 방지

### 3.5 컴포넌트 재사용

```jsx
// 승인 모달에서 ScheduleForm 재사용
import ScheduleForm from '../../components/schedule/ScheduleForm';

// pre-fill 데이터 생성
const prefilled = {
  title: request.title,
  description: request.description,
  date: request.preferred_dates?.[0] || '',
  start_time: request.preferred_start_time?.slice(0, 5) || '',
  end_time: request.preferred_end_time?.slice(0, 5) || '',
  location: request.preferred_location || '',
  capacity: request.expected_participants || 0,
  category: request.category || '',
  status: 'open'
};

<ScheduleForm schedule={prefilled} onSubmit={handleApprove} onCancel={closeModal} />
```

---

## 4. 트러블슈팅

### Q: 비로그인 사용자가 요청을 제출할 수 없어요
- Supabase RLS 정책 확인: `lecture_requests_insert_all` 정책이 존재하는지
- `WITH CHECK (true)` 설정되어 있는지

### Q: 승인했는데 일정이 생성되지 않아요
- 브라우저 콘솔에서 에러 확인
- Supabase `schedules` 테이블의 RLS 정책 확인 (INSERT 권한)
- 관리자 계정이 인증된 상태인지 확인

### Q: 다크모드에서 스타일이 깨져요
- `lectureRequest.css`의 `[data-theme="dark"]` 섹션 확인
- CSS 변수가 `dark-mode.css`에 정의되어 있는지 확인
