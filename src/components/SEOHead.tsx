interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
}

const SEOHead = ({ title, description, path = '', ogImage, noindex = false }: SEOHeadProps): React.ReactElement => {
  const SITE_NAME = 'Reserve | 강의 예약';
  const BASE = 'https://reserve.dreamitbiz.com';
  const DEFAULT_DESC = '강의 일정 관리 및 예약 서비스 - 다양한 강의 일정을 확인하고 간편하게 예약하세요';
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description ?? DEFAULT_DESC;
  const image = ogImage ?? `${BASE}/og-image.png`;

  // React 19+ natively hoists <title>, <meta>, <link> to <head>
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={`${BASE}${path}`} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
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
