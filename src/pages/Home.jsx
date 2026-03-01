import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import site from '../config/site';

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead
        title={`${site.name} | ${site.nameKo}`}
        description={site.description}
      />

      {/* Hero / Page Header */}
      <section className="page-header">
        <div className="container">
          <h2>{t('site.home.title')}</h2>
          <p>{t('site.home.subtitle')}</p>
        </div>
      </section>

      {/* Welcome Section - 하위 사이트 콘텐츠로 교체하세요 */}
      <section className="section">
        <div className="container">
          <div className="site-welcome">
            <h3>{t('site.home.welcome')}</h3>
            <p>{t('site.home.description')}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
