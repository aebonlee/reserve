import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import SEOHead from '../components/SEOHead';
import { getMyReservations, cancelReservation } from '../utils/reservationService';

const MyReservations = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user]);

  const loadReservations = async () => {
    setLoading(true);
    const data = await getMyReservations(user.id);
    setReservations(data);
    setLoading(false);
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm(t('reservation.cancelConfirm'))) return;
    try {
      await cancelReservation(reservationId);
      addToast(t('reservation.cancelSuccess'), 'success');
      loadReservations();
    } catch (err) {
      addToast(err.message || t('reservation.cancelError'), 'error');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (language === 'ko') {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    }
    return date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => time ? time.slice(0, 5) : '';

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const now = new Date();

  return (
    <>
      <SEOHead title={`${t('reservation.myReservations')} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{t('reservation.myReservations')}</h2>
          <p>{t('reservation.myReservationsDesc')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="reservation-filters">
            {['all', 'confirmed', 'cancelled'].map(f => (
              <button
                key={f}
                className={`category-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {t(`reservation.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64" style={{ color: 'var(--text-light)', marginBottom: '16px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p>{t('reservation.noReservations')}</p>
              <Link to="/schedule" className="btn btn-primary mt-3">{t('schedule.pageTitle')}</Link>
            </div>
          ) : (
            <div className="reservations-list">
              {filtered.map(r => {
                const schedule = r.schedules;
                const isPast = schedule && new Date(schedule.date + 'T' + (schedule.end_time || '23:59')) < now;
                return (
                  <div key={r.id} className={`reservation-item status-${r.status}${isPast ? ' past' : ''}`}>
                    <div className="reservation-item-main">
                      <div className="reservation-item-info">
                        <h4>
                          <Link to={`/schedule/${r.schedule_id}`}>
                            {schedule?.title || t('reservation.unknownSchedule')}
                          </Link>
                        </h4>
                        {schedule && (
                          <div className="reservation-item-meta">
                            <span>{formatDate(schedule.date)}</span>
                            <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                            {schedule.location && <span>{schedule.location}</span>}
                          </div>
                        )}
                      </div>
                      <div className="reservation-item-status">
                        <span className={`reservation-badge status-${r.status}`}>
                          {r.status === 'confirmed' ? t('reservation.confirmed') : t('reservation.cancelled')}
                        </span>
                        {isPast && <span className="reservation-badge past">{t('reservation.past')}</span>}
                      </div>
                    </div>
                    {r.status === 'confirmed' && !isPast && (
                      <div className="reservation-item-actions">
                        <button className="btn-cancel" onClick={() => handleCancel(r.id)}>
                          {t('reservation.cancel')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyReservations;
