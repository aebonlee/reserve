import type { SiteConfig } from '../types';

const site: SiteConfig = {
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
    { path: '/lecture-request', labelKey: 'nav.lectureRequest', activePath: '/lecture-request' },
    { path: '/instructor', labelKey: 'nav.instructor', activePath: '/instructor' },
    { path: '/my-reservations', labelKey: 'nav.myReservations', activePath: '/my-reservations', auth: true },
    { path: '/admin', labelKey: 'nav.admin', activePath: '/admin', admin: true }
  ],

  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/schedule', labelKey: 'nav.schedule' },
    { path: '/lecture-request', labelKey: 'nav.lectureRequest' },
    { path: '/instructor', labelKey: 'nav.instructor' }
  ]
};

export default site;
