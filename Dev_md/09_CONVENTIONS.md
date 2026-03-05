# 프로젝트 코딩 컨벤션 및 패턴

## 1. 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프론트엔드 | React | 19 |
| 빌드 도구 | Vite | 7.3 |
| 라우팅 | react-router-dom | 7 |
| 백엔드/DB | Supabase (PostgreSQL) | - |
| 배포 | GitHub Pages | - |

---

## 2. 파일/폴더 구조 패턴

```
src/
├── components/{도메인}/    # 도메인별 컴포넌트 폴더
├── pages/                  # 페이지 컴포넌트
├── pages/admin/            # 관리자 페이지
├── layouts/                # 레이아웃 (PublicLayout)
├── config/                 # 사이트 설정
├── contexts/               # React Context
├── utils/                  # 서비스 레이어 + 유틸리티
├── styles/                 # 모듈별 CSS
└── index.css               # CSS import 허브
```

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 파일 | PascalCase.jsx | `ScheduleForm.jsx` |
| 서비스 파일 | camelCase.js | `scheduleService.js` |
| CSS 파일 | camelCase.css | `lectureRequest.css` |
| 컴포넌트 폴더 | camelCase | `lectureRequest/` |
| 페이지 파일 | PascalCase.jsx | `LectureRequest.jsx` |

---

## 3. React 컴포넌트 패턴

### 페이지 컴포넌트 구조
```jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const PageName = () => {
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => { /* ... */ };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={t('page.title')} />
      <section className="page-header">
        <div className="container">
          <h2>{t('page.title')}</h2>
          <p>{t('page.subtitle')}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {/* 콘텐츠 */}
        </div>
      </section>
    </>
  );
};

export default PageName;
```

### 라우트 등록 (lazy + Suspense)
```jsx
// PublicLayout.jsx
const NewPage = lazy(() => import('../pages/NewPage'));
// ...
<Route path="/new-page" element={<NewPage />} />
```

### Guard 적용
```jsx
<Route path="/protected" element={<AuthGuard><ProtectedPage /></AuthGuard>} />
<Route path="/admin/xxx" element={<AdminGuard><AdminPage /></AdminGuard>} />
```

---

## 4. 서비스 레이어 패턴

```js
import getSupabase from './supabase';

export const getItems = async () => {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getItems error:', error);
    return [];
  }
  return data || [];
};

export const createItem = async (data) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: item, error } = await client
    .from('table_name')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return item;
};
```

### 규칙
- 조회 함수: 에러 시 빈 값 반환 (`[]`, `null`, `{ total: 0, ... }`)
- 생성/수정/삭제 함수: 에러 시 `throw` (호출자가 처리)
- `getSupabase()` null 체크 항상 수행

---

## 5. 다국어 (i18n) 패턴

### 번역 키 추가
```js
// translations.js
export const translations = {
  ko: {
    domain: {
      keyName: '한국어 텍스트',
    }
  },
  en: {
    domain: {
      keyName: 'English text',
    }
  }
};
```

### 사용
```jsx
const { t, language } = useLanguage();
<h2>{t('domain.keyName')}</h2>
```

### 날짜 포맷
```jsx
if (language === 'ko') {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
```

---

## 6. CSS 패턴

### CSS 변수 (base.css에 정의)
```css
var(--bg-white)         /* 배경색 */
var(--bg-light-gray)    /* 밝은 회색 배경 */
var(--bg-medium-gray)   /* 중간 회색 배경 */
var(--border-light)     /* 밝은 테두리 */
var(--border-medium)    /* 중간 테두리 */
var(--text-primary)     /* 주 텍스트 */
var(--text-secondary)   /* 보조 텍스트 */
var(--text-light)       /* 연한 텍스트 */
var(--primary-blue)     /* 테마 컬러 #0046C8 */
var(--radius-sm)        /* 작은 라운드 */
var(--radius-md)        /* 중간 라운드 */
var(--radius-lg)        /* 큰 라운드 */
var(--radius-full)      /* 완전 라운드 */
var(--shadow-sm)        /* 작은 그림자 */
var(--shadow-md)        /* 중간 그림자 */
var(--shadow-lg)        /* 큰 그림자 */
var(--transition-base)  /* 기본 트랜지션 */
```

### CSS 파일 구조
```css
/* 1. 기본 스타일 */
.component { ... }

/* 2. 반응형 */
@media (max-width: 768px) { ... }

/* 3. 다크모드 */
[data-theme="dark"] .component { ... }
```

### 새 CSS 파일 추가 시
1. `src/styles/` 폴더에 파일 생성
2. `src/index.css`에 `@import` 추가 (`dark-mode.css` 앞에)

---

## 7. 상태 뱃지 컬러

### Light 모드

| 상태 | 배경 | 글자색 |
|------|------|--------|
| open / approved | `#DCFCE7` | `#166534` |
| pending / closed | `#FEF3C7` | `#92400E` |
| rejected / cancelled | `#FEE2E2` | `#991B1B` |

### Dark 모드

| 상태 | 배경 | 글자색 |
|------|------|--------|
| open / approved | `#064E3B` | `#6EE7B7` |
| pending / closed | `#78350F` | `#FCD34D` |
| rejected / cancelled | `#7F1D1D` | `#FCA5A5` |

---

## 8. 메뉴/라우트 추가 체크리스트

새 기능 추가 시 다음을 모두 처리:

- [ ] `src/config/site.js` — menuItems에 추가
- [ ] `src/config/site.js` — footerLinks에 추가 (필요시)
- [ ] `src/layouts/PublicLayout.jsx` — lazy import + Route 추가
- [ ] `src/utils/translations.js` — `nav.*` 키 추가 (ko/en)
- [ ] 관리자 페이지인 경우 `<AdminGuard>` 래핑
- [ ] 인증 필요 페이지인 경우 `<AuthGuard>` 래핑
