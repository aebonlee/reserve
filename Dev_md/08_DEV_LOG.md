# 개발 일지 (Development Log)

---

## 2026-03-05 — 강의 요청 게시판 기능 추가

### 작업 개요
외부 강의 의뢰인이 비로그인으로 강의 요청을 제출하고, 관리자가 승인 시 자동 일정 생성되는 게시판 기능을 전체 구현했다.

### 작업 단계

| # | 단계 | 상태 | 비고 |
|---|------|------|------|
| 1 | SQL 스크립트 작성 | 완료 | `supabase/lecture_requests.sql` |
| 2 | 서비스 레이어 작성 | 완료 | `lectureRequestService.js` |
| 3 | 스타일 작성 | 완료 | `lectureRequest.css` (다크모드+반응형) |
| 4 | 번역 키 추가 | 완료 | ko/en 양쪽 `lectureRequest.*` 약 55개 키 |
| 5 | CSS import 추가 | 완료 | `index.css` |
| 6 | DatePicker 컴포넌트 | 완료 | 복수 날짜 캘린더, 과거 날짜 비활성화 |
| 7 | LectureRequestForm | 완료 | 3섹션 폼 (요청자/강의/일정) |
| 8 | LectureRequestCard | 완료 | 카드 UI, 상태 뱃지 |
| 9 | LectureRequestSubmit | 완료 | 제출 페이지 + 성공 화면 |
| 10 | LectureRequest | 완료 | 목록 페이지 + 상태 필터 |
| 11 | 메뉴 추가 | 완료 | `site.js` menuItems, footerLinks |
| 12 | 라우트 추가 | 완료 | `PublicLayout.jsx` 3개 라우트 |
| 13 | LectureRequestManage | 완료 | 관리자 테이블/상세/승인모달/반려모달 |
| 14 | 대시보드 통계 추가 | 완료 | StatsCard + 바로가기 링크 |
| 15 | 빌드 검증 | 완료 | `npm run build` 성공, 에러 없음 |
| 16 | Supabase SQL 실행 | 완료 | 사용자가 수동 실행 확인 |
| 17 | Dev_md 문서화 | 완료 | 9개 문서 작성 |

### 생성한 파일 (9개)

```
supabase/lecture_requests.sql
src/utils/lectureRequestService.js
src/styles/lectureRequest.css
src/components/lectureRequest/DatePicker.jsx
src/components/lectureRequest/LectureRequestForm.jsx
src/components/lectureRequest/LectureRequestCard.jsx
src/pages/LectureRequest.jsx
src/pages/LectureRequestSubmit.jsx
src/pages/admin/LectureRequestManage.jsx
```

### 수정한 파일 (5개)

```
src/index.css                       ← lectureRequest.css import 추가
src/config/site.js                  ← 메뉴 + 푸터 링크 추가
src/layouts/PublicLayout.jsx        ← lazy import 3개 + Route 3개
src/pages/admin/AdminDashboard.jsx  ← 통계 카드 + 바로가기 추가
src/utils/translations.js           ← lectureRequest.* 번역 키 (ko/en)
```

### 설계 결정

1. **CSS 접두사 `lr-` 사용** — 기존 `schedule-*`과 충돌 방지
2. **ScheduleForm 재사용** — 승인 모달에서 기존 컴포넌트 직접 import
3. **비로그인 제출** — RLS INSERT `WITH CHECK (true)` + AuthGuard 미적용
4. **순차 호출 (비트랜잭션)** — 승인 시 createSchedule → 상태 업데이트 (일정 생성 실패 시 상태 미변경)

### 빌드 결과

```
vite v7.3.1 building client environment for production...
✓ 124 modules transformed
✓ built in 2.65s
```

주요 번들 크기:
- `LectureRequest.js` — 4.30 kB
- `LectureRequestSubmit.js` — 9.91 kB
- `LectureRequestManage.js` — 11.44 kB
- `lectureRequestService.js` — 2.40 kB

---

## 이전 커밋 이력 (참고)

| 해시 | 메시지 |
|------|--------|
| `19da9a5` | fix: CNAME을 reserve.dreamitbiz.com으로 변경 |
| `ca8da41` | fix: GitHub Pages SPA 라우팅 지원 (404.html) 및 빌드 수정 |
| `75209ea` | fix: index.css에서 삭제된 shop.css 대신 schedule/reservation CSS import |
| `2873968` | feat: 쇼핑몰 템플릿을 강의 예약 시스템으로 전환 |
| `73b72cd` | feat: GitHub Pages 배포 설정 (templete.dreamitbiz.com) |
