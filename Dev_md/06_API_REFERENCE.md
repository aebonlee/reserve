# 서비스 레이어 API 레퍼런스

## 1. 개요

서비스 파일들은 `src/utils/` 폴더에 위치하며, Supabase JS SDK를 사용하여 DB와 통신합니다.
모든 함수는 `async`이며 `getSupabase()` 클라이언트를 내부적으로 사용합니다.

---

## 2. lectureRequestService.js

파일 경로: `src/utils/lectureRequestService.js`

### 2.1 `getLectureRequests(statusFilter?)`

강의 요청 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `statusFilter` | `string \| null` | 아니오 | `'pending'`, `'approved'`, `'rejected'` 또는 `null`(전체) |

**반환값:** `Array<LectureRequest>` (에러 시 빈 배열)

```js
const all = await getLectureRequests();           // 전체
const pending = await getLectureRequests('pending'); // 대기중만
```

---

### 2.2 `getLectureRequestById(id)`

단일 강의 요청을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `string (UUID)` | 예 | 요청 ID |

**반환값:** `LectureRequest | null`

---

### 2.3 `getLectureRequestStats()`

전체 통계를 반환합니다.

**파라미터:** 없음

**반환값:**
```js
{
  total: number,
  pending: number,
  approved: number,
  rejected: number
}
```

---

### 2.4 `submitLectureRequest(formData)`

새 강의 요청을 제출합니다. **비로그인 사용자도 호출 가능.**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `formData` | `object` | 예 | 아래 참조 |

**formData 구조:**

```js
{
  requester_name: string,         // 필수
  requester_email: string,        // 필수
  requester_phone: string,        // 선택
  requester_organization: string, // 선택
  title: string,                  // 필수
  description: string,            // 선택
  category: string,               // 선택
  preferred_dates: string[],      // 선택 (['2026-03-10', ...])
  date_range_start: string,       // 선택 ('2026-03-10')
  date_range_end: string,         // 선택
  date_notes: string,             // 선택
  preferred_start_time: string,   // 선택 ('09:00')
  preferred_end_time: string,     // 선택 ('17:00')
  preferred_location: string,     // 선택
  expected_participants: number,  // 선택
}
```

**반환값:** `LectureRequest` (생성된 레코드)
**에러:** `throw Error` (Supabase 에러)

---

### 2.5 `approveLectureRequest(id, scheduleData)`

요청을 승인하고 일정을 자동 생성합니다. **관리자만 호출 가능.**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `string (UUID)` | 예 | 요청 ID |
| `scheduleData` | `object` | 예 | `schedules` 테이블에 삽입할 데이터 |

**처리 순서:**
1. `scheduleService.createSchedule(scheduleData)` → 일정 생성
2. `lecture_requests` 상태 → `approved`, `created_schedule_id` 연결
3. `reviewed_by`, `reviewed_at` 설정

**반환값:** `Schedule` (생성된 일정 레코드)
**에러:** `throw Error`

```js
const schedule = await approveLectureRequest(requestId, {
  title: '리액트 강의',
  description: '...',
  date: '2026-03-15',
  start_time: '10:00',
  end_time: '12:00',
  location: '서울',
  capacity: 30,
  category: 'IT',
  status: 'open'
});
```

---

### 2.6 `rejectLectureRequest(id, adminNotes)`

요청을 반려합니다. **관리자만 호출 가능.**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `string (UUID)` | 예 | 요청 ID |
| `adminNotes` | `string` | 예 | 반려 사유 |

**반환값:** `void`
**에러:** `throw Error`

---

### 2.7 `deleteLectureRequest(id)`

요청을 삭제합니다. **관리자만 호출 가능.**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `string (UUID)` | 예 | 요청 ID |

**반환값:** `void`
**에러:** `throw Error`

---

## 3. scheduleService.js (기존)

파일 경로: `src/utils/scheduleService.js`

| 함수 | 설명 | 호출 위치 |
|------|------|----------|
| `getSchedules(year, month)` | 월별 일정 조회 | Schedule, AdminDashboard |
| `getScheduleById(id)` | 일정 상세 | ScheduleDetail |
| `getUpcomingSchedules(limit)` | 다가오는 일정 | Home |
| `createSchedule(data)` | 일정 생성 | ScheduleManage, **approveLectureRequest** |
| `updateSchedule(id, data)` | 일정 수정 | ScheduleManage |
| `deleteSchedule(id)` | 일정 삭제 | ScheduleManage |

---

## 4. LectureRequest 타입 정의 (참고용)

```typescript
// TypeScript 미사용이지만 참고용으로 정의

interface LectureRequest {
  id: string;                       // UUID
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  requester_organization: string | null;
  title: string;
  description: string | null;
  category: string | null;
  preferred_dates: string[] | null;
  date_range_start: string | null;  // 'YYYY-MM-DD'
  date_range_end: string | null;
  date_notes: string | null;
  preferred_start_time: string | null; // 'HH:MM:SS'
  preferred_end_time: string | null;
  preferred_location: string | null;
  expected_participants: number | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by: string | null;       // UUID
  reviewed_at: string | null;       // ISO datetime
  created_schedule_id: string | null; // UUID
  created_at: string;               // ISO datetime
  updated_at: string;               // ISO datetime
}
```
