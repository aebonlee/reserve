/**
 * 사이트 설정 파일
 * 하위 사이트의 브랜드, 메뉴, 푸터 등을 정의합니다.
 * 이 파일만 수정하면 Navbar/Footer가 자동으로 반영됩니다.
 */

const site = {
  // 사이트 기본 정보
  name: 'DreamIT Books',
  nameKo: '드림아이티 출판사',
  description: 'DreamIT Biz 출판사 - 도서, 전자출판, 간행물',
  url: 'https://books.dreamitbiz.com',

  // 부모 사이트
  parentSite: {
    name: 'DreamIT Biz',
    url: 'https://www.dreamitbiz.com'
  },

  // 브랜드 로고 텍스트
  brand: {
    parts: [
      { text: 'Dream', className: 'brand-dream' },
      { text: 'IT', className: 'brand-it' },
      { text: 'Books', className: 'brand-biz' }
    ]
  },

  // 테마 컬러 (meta theme-color)
  themeColor: '#0046C8',

  // 네비게이션 메뉴
  // dropdown이 있으면 서브메뉴, 없으면 단일 링크
  menuItems: [
    { path: '/', labelKey: 'nav.home' },
    {
      labelKey: 'site.nav.books',
      path: '/books',
      activePath: '/books',
      dropdown: [
        { path: '/books/it', labelKey: 'site.nav.itBooks' },
        { path: '/books/education', labelKey: 'site.nav.eduBooks' }
      ]
    },
    { path: '/shop', labelKey: 'shop.title', activePath: '/shop' }
  ],

  // 푸터 바로가기 링크
  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/books', labelKey: 'site.nav.books' },
    { path: '/shop', labelKey: 'shop.title' }
  ],

  // Family Site 목록 (부모 사이트 + 형제 사이트)
  familySites: [
    { name: 'DreamIT Biz (본사이트)', url: 'https://www.dreamitbiz.com' },
    { name: 'AHP 연구 플랫폼', url: 'https://ahp-basic.dreamitbiz.com' },
    { name: '핵심역량 자가측정', url: 'https://competency.dreamitbiz.com' }
  ]
};

export default site;
