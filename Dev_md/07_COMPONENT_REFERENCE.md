# 컴포넌트 구조 및 Props 레퍼런스

## 1. 강의 요청 컴포넌트 트리

```
pages/
├── LectureRequest.jsx              ← /lecture-request (목록)
│   └── LectureRequestCard.jsx      ← 카드 아이템
├── LectureRequestSubmit.jsx        ← /lecture-request/new (제출)
│   └── LectureRequestForm.jsx      ← 제출 폼
│       └── DatePicker.jsx          ← 복수 날짜 캘린더
└── admin/
    └── LectureRequestManage.jsx    ← /admin/lecture-requests (관리)
        ├── StatsCard.jsx           ← 통계 카드 (기존 재사용)
        ├── ScheduleForm.jsx        ← 승인 모달 (기존 재사용)
        └── TableRow (내부)          ← 테이블 행 + 확장 상세
```

---

## 2. DatePicker

**파일:** `src/components/lectureRequest/DatePicker.jsx`
**용도:** 복수 날짜를 캘린더에서 선택할 수 있는 컴포넌트

### Props

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `selectedDates` | `string[]` | 아니오 | `[]` | 선택된 날짜 배열 (`'YYYY-MM-DD'`) |
| `onChange` | `(dates: string[]) => void` | 예 | - | 날짜 변경 콜백 |

### 기능
- 월 이동 (이전/다음)
- 날짜 클릭 → 토글 (선택/해제)
- 과거 날짜 선택 불가 (`.past` 클래스)
- 선택된 날짜 태그 표시 (x 버튼으로 제거)
- 한국어/영어 요일 및 월 표시

### 사용 예시
```jsx
<DatePicker
  selectedDates={['2026-03-10', '2026-03-15']}
  onChange={(dates) => setForm(prev => ({ ...prev, preferred_dates: dates }))}
/>
```

---

## 3. LectureRequestForm

**파일:** `src/components/lectureRequest/LectureRequestForm.jsx`
**용도:** 강의 요청 제출 폼 (3개 섹션)

### Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `onSubmit` | `(formData: object) => void` | 예 | 폼 제출 콜백 |
| `loading` | `boolean` | 아니오 | 제출 중 상태 (버튼 비활성화) |

### 내부 상태 (useState)
```js
{
  requester_name: '',
  requester_email: '',
  requester_phone: '',
  requester_organization: '',
  title: '',
  description: '',
  category: '',
  preferred_dates: [],      // DatePicker에서 관리
  date_range_start: '',
  date_range_end: '',
  date_notes: '',
  preferred_start_time: '',
  preferred_end_time: '',
  preferred_location: '',
  expected_participants: ''
}
```

### 폼 섹션 구조
1. **요청자 정보** — 이름*, 이메일*, 전화번호, 소속
2. **강의 정보** — 제목*, 설명, 카테고리, 예상 인원
3. **희망 일정** — DatePicker, 날짜 범위, 메모, 시간, 장소

---

## 4. LectureRequestCard

**파일:** `src/components/lectureRequest/LectureRequestCard.jsx`
**용도:** 목록 페이지의 요청 카드 아이템

### Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `request` | `LectureRequest` | 예 | 요청 데이터 객체 |
| `onClick` | `() => void` | 아니오 | 카드 클릭 콜백 |

### 표시 정보
- 상태 뱃지 (pending/approved/rejected)
- 카테고리 뱃지
- 제목
- 설명 (2줄 말줄임)
- 요청자 이름 + 소속
- 희망 날짜 (최대 3개 + 추가 개수)
- 희망 장소
- 요청일 + 이메일

---

## 5. LectureRequest (목록 페이지)

**파일:** `src/pages/LectureRequest.jsx`
**라우트:** `/lecture-request`

### 기능
- 상태별 필터 (전체/대기중/승인됨/반려됨)
- "강의 요청하기" 버튼 → `/lecture-request/new`
- 카드 그리드 (LectureRequestCard)
- 빈 상태 표시

---

## 6. LectureRequestSubmit (제출 페이지)

**파일:** `src/pages/LectureRequestSubmit.jsx`
**라우트:** `/lecture-request/new`

### 기능
- LectureRequestForm 렌더링
- 제출 → `submitLectureRequest()` 호출
- 성공 시 성공 화면 (체크 아이콘 + 메시지)
- "새 요청하기" / "목록으로" 버튼

---

## 7. LectureRequestManage (관리자 페이지)

**파일:** `src/pages/admin/LectureRequestManage.jsx`
**라우트:** `/admin/lecture-requests`
**접근:** AdminGuard (관리자 전용)

### 기능

| 영역 | 설명 |
|------|------|
| **통계 카드** | 전체, 대기중, 승인, 반려 개수 (StatsCard) |
| **필터** | 상태별 + 개수 표시 |
| **검색** | 제목, 이름, 이메일, 소속으로 필터링 |
| **테이블** | 상태, 제목, 이름, 이메일, 요청일 |
| **상세 확장** | 행 클릭 시 전체 정보 표시 |
| **승인 모달** | ScheduleForm (pre-fill) → 일정 자동 생성 |
| **반려 모달** | 사유 입력 → 반려 처리 |
| **삭제** | 확인 후 영구 삭제 |

### 내부 컴포넌트: TableRow

```jsx
<TableRow
  req={request}
  expanded={boolean}
  onToggle={() => void}
  onApprove={() => void}
  onReject={() => void}
  onDelete={() => void}
  formatDate={(dateStr) => string}
  t={translateFunction}
  language={'ko' | 'en'}
/>
```

---

## 8. 수정된 기존 컴포넌트

### AdminDashboard.jsx

**추가된 항목:**
- `getLectureRequestStats` import 및 호출
- `pendingLectureRequests` 통계 (StatsCard)
- "강의 요청 관리" 바로가기 링크

### PublicLayout.jsx

**추가된 항목:**
```jsx
// lazy imports
const LectureRequest = lazy(() => import('../pages/LectureRequest'));
const LectureRequestSubmit = lazy(() => import('../pages/LectureRequestSubmit'));
const LectureRequestManage = lazy(() => import('../pages/admin/LectureRequestManage'));

// Routes
<Route path="/lecture-request" element={<LectureRequest />} />
<Route path="/lecture-request/new" element={<LectureRequestSubmit />} />
<Route path="/admin/lecture-requests" element={<AdminGuard><LectureRequestManage /></AdminGuard>} />
```
