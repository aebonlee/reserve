# 관리자 회원 관리 페이지

## 작업일: 2026-03-05

## 개요
관리자가 reserve 사이트에서 직접 가입한 회원만 필터링하여 볼 수 있는 회원 관리 페이지 추가.

---

## 필터링 로직
- `user_profiles` 테이블의 `signup_domain` 컬럼을 기준으로 필터링
- `window.location.hostname`과 일치하는 도메인의 회원만 조회
- 외부 서비스나 다른 도메인에서 가입한 사용자는 제외

---

## 생성/수정 파일

### 새 파일
1. **`src/utils/userService.js`** - 회원 조회 서비스
   - `getSiteMembers()`: signup_domain 기준 필터링된 회원 목록 조회
   - `getMemberStats()`: 회원 통계 (전체/일반/관리자)

2. **`src/pages/admin/MemberManage.jsx`** - 회원 관리 페이지
   - 통계 카드: 전체 회원 수, 일반 회원 수, 관리자 수
   - 검색: 이름/이메일로 필터링
   - 테이블: 이름, 이메일, 역할(배지), 가입일 표시

### 수정 파일
3. **`src/layouts/PublicLayout.jsx`** - `/admin/members` 라우트 추가
4. **`src/pages/admin/AdminDashboard.jsx`** - 회원 관리 바로가기 링크 추가
5. **`src/utils/translations.js`** - 회원 관리 관련 ko/en 번역 키 추가

---

## 접근 경로
- URL: `/admin/members`
- 관리자 대시보드 → "회원 관리" 바로가기 링크

---

## 빌드 결과
- `npm run build` 성공
- 커밋: `9b42475`
