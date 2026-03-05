import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import StatsCard from '../../components/admin/StatsCard';
import { getSchedules } from '../../utils/scheduleService';
import { getReservationStats, getAllReservations } from '../../utils/reservationService';
import { getLectureRequestStats } from '../../utils/lectureRequestService';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ totalSchedules: 0, monthSchedules: 0, totalReservations: 0, confirmedReservations: 0, pendingLectureRequests: 0 });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const [monthSchedules, reservationStats, allReservations, lrStats] = await Promise.all([
        getSchedules(year, month),
        getReservationStats(),
        getAllReservations(),
        getLectureRequestStats()
      ]);

      setStats({
        monthSchedules: monthSchedules.length,
        totalReservations: reservationStats.total,
        confirmedReservations: reservationStats.confirmed,
        cancelledReservations: reservationStats.cancelled,
        pendingLectureRequests: lrStats.pending
      });

      setRecentReservations(allReservations.slice(0, 5));
      setLoading(false);
    };
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
      <SEOHead title={`${t('admin.dashboard')} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{t('admin.dashboard')}</h2>
          <p>{t('admin.dashboardDesc')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-stats-grid">
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
              label={t('admin.monthSchedules')}
              value={stats.monthSchedules}
              color="blue"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
              label={t('admin.totalReservations')}
              value={stats.totalReservations}
              color="green"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
              label={t('admin.confirmedReservations')}
              value={stats.confirmedReservations}
              color="green"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
              label={t('admin.cancelledReservations')}
              value={stats.cancelledReservations || 0}
              color="red"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>}
              label={t('lectureRequest.pendingRequests')}
              value={stats.pendingLectureRequests || 0}
              color="blue"
            />
          </div>

          <div className="admin-quick-links">
            <Link to="/admin/schedules" className="admin-quick-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {t('admin.manageSchedules')}
            </Link>
            <Link to="/admin/reservations" className="admin-quick-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              {t('admin.manageReservations')}
            </Link>
            <Link to="/admin/lecture-requests" className="admin-quick-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="12" y2="12" /><line x1="15" y1="15" x2="12" y2="12" /></svg>
              {t('lectureRequest.adminManage')}
            </Link>
          </div>

          {recentReservations.length > 0 && (
            <div className="admin-recent-section">
              <h3>{t('admin.recentReservations')}</h3>
              <div className="admin-recent-list">
                {recentReservations.map(r => (
                  <div key={r.id} className="admin-recent-item">
                    <div className="admin-recent-info">
                      <span className="admin-recent-name">{r.user_name}</span>
                      <span className="admin-recent-schedule">{r.schedules?.title || '-'}</span>
                    </div>
                    <div className="admin-recent-meta">
                      <span className={`reservation-badge status-${r.status}`}>
                        {r.status === 'confirmed' ? t('reservation.confirmed') : t('reservation.cancelled')}
                      </span>
                      <span className="admin-recent-date">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
