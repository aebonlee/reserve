# Reserve 프로젝트 개요

## 1. 프로젝트 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Reserve (강의 예약) |
| **URL** | https://reserve.dreamitbiz.com |
| **기술 스택** | React 19 + Vite 7 + Supabase |
| **배포** | GitHub Pages (SPA 라우팅, 404.html) |
| **테마 컬러** | `#0046C8` |
| **다국어** | 한국어(ko) / 영어(en) |
| **다크모드** | 지원 (`[data-theme="dark"]`) |

---

## 2. 핵심 기능

### 2.1 강의 일정 (Schedule)
- 월별 캘린더 뷰 / 리스트 뷰
- 카테고리별 필터링
- 일정 상세 페이지 → 예약 기능

### 2.2 예약 (Reservation)
- 로그인 사용자만 예약 가능
- 예약 확정/취소 관리
- 내 예약 목록

### 2.3 강의 요청 (Lecture Request) — *2026-03-05 추가*
- 비로그인 사용자가 강의를 요청
- 관리자가 검토 → 승인 시 자동 일정 생성
- 승인/반려 워크플로우

### 2.4 관리자 (Admin)
- 대시보드 (통계, 바로가기)
- 일정 CRUD
- 예약 관리
- 강의 요청 관리

---

## 3. 디렉토리 구조

```
src/
├── components/
│   ├── admin/           # StatsCard 등 관리자 UI
│   ├── common/          # AdminGuard 등 공통
│   ├── layout/          # Navbar, Footer
│   ├── lectureRequest/  # 강의 요청 컴포넌트
│   └── schedule/        # 일정 컴포넌트 (CalendarView, ScheduleCard, ScheduleForm)
├── config/
│   └── site.js          # 사이트 설정 (메뉴, 브랜드)
├── contexts/
│   ├── AuthContext.jsx   # 인증 상태
│   └── LanguageContext.jsx # 다국어
├── layouts/
│   └── PublicLayout.jsx  # 메인 레이아웃 + 라우팅
├── pages/
│   ├── admin/           # AdminDashboard, ScheduleManage, ReservationManage, LectureRequestManage
│   ├── Home.jsx
│   ├── Schedule.jsx
│   ├── ScheduleDetail.jsx
│   ├── LectureRequest.jsx
│   ├── LectureRequestSubmit.jsx
│   ├── MyReservations.jsx
│   ├── Login.jsx / Register.jsx / ForgotPassword.jsx / MyPage.jsx
│   └── NotFound.jsx
├── styles/              # 모듈별 CSS
│   ├── base.css, navbar.css, hero.css, footer.css
│   ├── schedule.css, reservation.css, auth.css
│   ├── lectureRequest.css
│   ├── animations.css, search.css, toast.css
│   ├── dark-mode.css, responsive.css, site.css
│   └── ...
├── utils/
│   ├── supabase.js            # Supabase 클라이언트
│   ├── scheduleService.js     # 일정 CRUD
│   ├── reservationService.js  # 예약 CRUD
│   ├── lectureRequestService.js # 강의 요청 CRUD
│   └── translations.js        # 번역 데이터
├── index.css            # CSS import 허브
└── main.jsx             # 엔트리포인트
```

---

## 4. 라우트 맵

| 경로 | 페이지 | 접근 제한 |
|------|--------|----------|
| `/` | Home | 없음 |
| `/schedule` | Schedule (목록) | 없음 |
| `/schedule/:id` | ScheduleDetail | 없음 |
| `/lecture-request` | LectureRequest (목록) | 없음 |
| `/lecture-request/new` | LectureRequestSubmit | 없음 (비로그인 가능) |
| `/my-reservations` | MyReservations | AuthGuard |
| `/login` | Login | 없음 |
| `/register` | Register | 없음 |
| `/forgot-password` | ForgotPassword | 없음 |
| `/mypage` | MyPage | AuthGuard |
| `/admin` | AdminDashboard | AdminGuard |
| `/admin/schedules` | ScheduleManage | AdminGuard |
| `/admin/reservations` | ReservationManage | AdminGuard |
| `/admin/lecture-requests` | LectureRequestManage | AdminGuard |

---

## 5. 외부 의존성

- `react` / `react-dom` (v19)
- `react-router-dom` (v7)
- `@supabase/supabase-js`
- `vite` (v7.3)

---

## 6. 환경 변수

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxx...
```
