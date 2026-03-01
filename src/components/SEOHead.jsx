import { useLanguage } from '../contexts/LanguageContext';

const SEOHead = ({ title, description, path = '', ogImage, noindex = false }) => {
  const SITE = 'DreamIT Biz | 드림아이티비즈';
  const BASE = 'https://www.dreamitbiz.com';
  const DEFAULT_DESC = '웹개발, 웹호스팅, 디자인, 기업컨설팅, 기업 맞춤 강의, 출판사업을 제공하는 IT 정보통신 전문 기업';
  const fullTitle = title ? `${title} | ${SITE}` : SITE;
  const desc = description || DEFAULT_DESC;
  const image = ogImage || `${BASE}/assets/images/og-default.png`;

  const { language } = useLanguage();

  // React 19+ natively hoists <title>, <meta>, <link> to <head>
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={`${BASE}${path}`} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={`${BASE}${path}`} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </>
  );
};

export default SEOHead;
