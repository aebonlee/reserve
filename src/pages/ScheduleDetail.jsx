import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import SEOHead from '../components/SEOHead';
import ReservationForm from '../components/schedule/ReservationForm';
import { getScheduleById } from '../utils/scheduleService';
import { createReservation, checkExistingReservation } from '../utils/reservationService';

const ScheduleDetail = () => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [existingReservation, setExistingReservation] = useState(null);
  const [reservationDone, setReservationDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getScheduleById(id);
      setSchedule(data);
      if (data && user) {
        const existing = await checkExistingReservation(id, user.id);
        setExistingReservation(existing);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  const handleReservation = async (formData) => {
    setReserving(true);
    try {
      await createReservation(id, formData);
      setReservationDone(true);
      addToast(t('reservation.success'), 'success');
      // Refresh schedule
      const updated = await getScheduleById(id);
      setSchedule(updated);
    } catch (err) {
      addToast(err.message || t('reservation.error'), 'error');
    } finally {
      setReserving(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (language === 'ko') {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
    return date.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (time) => time ? time.slice(0, 5) : '';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <p>{t('schedule.notFound')}</p>
            <Link to="/schedule" className="btn btn-primary mt-3">{t('schedule.backToList')}</Link>
          </div>
        </div>
      </section>
    );
  }

  const remaining = schedule.capacity > 0
    ? schedule.capacity - (schedule.current_count || 0)
    : null;
  const isFull = remaining !== null && remaining <= 0;
  const canReserve = schedule.status === 'open' && !isFull && !existingReservation && !reservationDone;

  return (
    <>
      <SEOHead title={`${schedule.title} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{schedule.title}</h2>
          <p>{formatDate(schedule.date)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="schedule-detail-layout">
            <div className="schedule-detail-info">
              <div className="detail-card">
                <h3>{t('schedule.details')}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">{t('schedule.date')}</span>
                    <span className="detail-value">{formatDate(schedule.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{t('schedule.time')}</span>
                    <span className="detail-value">{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                  </div>
                  {schedule.location && (
                    <div className="detail-item">
                      <span className="detail-label">{t('schedule.location')}</span>
                      <span className="detail-value">{schedule.location}</span>
                    </div>
                  )}
                  {schedule.category && (
                    <div className="detail-item">
                      <span className="detail-label">{t('schedule.category')}</span>
                      <span className="detail-value">{schedule.category}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">{t('schedule.status')}</span>
                    <span className={`schedule-status status-${schedule.status}`}>
                      {t(`schedule.status${schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}`)}
                    </span>
                  </div>
                  {schedule.capacity > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">{t('schedule.capacity')}</span>
                      <span className="detail-value">
                        {schedule.current_count || 0} / {schedule.capacity}
                        {isFull && <span className="full-badge"> ({t('schedule.full')})</span>}
                      </span>
                    </div>
                  )}
                </div>
                {schedule.description && (
                  <div className="detail-description">
                    <h4>{t('schedule.description')}</h4>
                    <p>{schedule.description}</p>
                  </div>
                )}
              </div>
              <Link to="/schedule" className="btn btn-secondary mt-3">{t('schedule.backToList')}</Link>
            </div>

            <div className="schedule-detail-reservation">
              <div className="reservation-card">
                <h3>{t('reservation.title')}</h3>
                {!isLoggedIn ? (
                  <div className="reservation-login-prompt">
                    <p>{t('reservation.loginRequired')}</p>
                    <Link to="/login" className="btn btn-primary">{t('auth.login')}</Link>
                  </div>
                ) : existingReservation || reservationDone ? (
                  <div className="reservation-done">
                    <div className="reservation-done-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <p>{t('reservation.alreadyReserved')}</p>
                    <Link to="/my-reservations" className="btn btn-secondary mt-2">
                      {t('reservation.viewMyReservations')}
                    </Link>
                  </div>
                ) : !canReserve ? (
                  <div className="reservation-closed">
                    <p>{isFull ? t('schedule.full') : t('schedule.notAvailable')}</p>
                  </div>
                ) : (
                  <ReservationForm onSubmit={handleReservation} loading={reserving} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ScheduleDetail;
