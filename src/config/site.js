/**
 * 사이트 설정 파일
 * 네비게이션, 푸터, 브랜드 등 사이트 전반 설정
 */

const site = {
  name: 'Reserve',
  nameKo: '강의 예약',
  description: 'Reserve - 강의 일정 관리 및 예약 사이트',
  url: 'https://reserve.example.com',

  brand: {
    parts: [
      { text: 'Re', className: 'brand-dream' },
      { text: 'serve', className: 'brand-it' }
    ]
  },

  themeColor: '#0046C8',

  menuItems: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/schedule', labelKey: 'nav.schedule', activePath: '/schedule' },
    { path: '/my-reservations', labelKey: 'nav.myReservations', activePath: '/my-reservations', auth: true },
    { path: '/admin', labelKey: 'nav.admin', activePath: '/admin', admin: true }
  ],

  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/schedule', labelKey: 'nav.schedule' }
  ]
};

export default site;
