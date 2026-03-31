import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import ScheduleCard from '../components/schedule/ScheduleCard';
import { getUpcomingSchedules } from '../utils/scheduleService';
import site from '../config/site';
import type { Schedule } from '../types';

const Home = (): React.ReactElement => {
  const { t } = useLanguage();
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const data = await getUpcomingSchedules(4);
      setUpcomingSchedules(data);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <>
      <SEOHead
        title={`${site.name} | ${site.nameKo}`}
        description={site.description}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-effect">
          <div className="hero-background">
            <div className="particles">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    '--duration': `${15 + Math.random() * 15}s`,
                    animationDelay: `${Math.random() * 10}s`
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">
              <span className="title-line">{t('site.home.title')}</span>
              <span className="title-line">
                <span className="highlight">{t('site.home.highlight')}</span>
              </span>
            </h2>
            <p className="hero-description">{t('site.home.subtitle')}</p>
            <div className="hero-buttons">
              <Link to="/schedule" className="btn btn-primary">{t('site.home.viewSchedule')}</Link>
              <Link to="/schedule" className="btn btn-secondary">{t('site.home.makeReservation')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Schedules */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">{t('site.home.upcoming')}</h3>
            <p className="section-subtitle">{t('site.home.upcomingDesc')}</p>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : upcomingSchedules.length > 0 ? (
            <>
              <div className="schedule-grid">
                {upcomingSchedules.map(schedule => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
              <div className="text-center mt-4">
                <Link to="/schedule" className="btn btn-secondary">{t('site.home.viewAll')}</Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>{t('schedule.noSchedules')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
