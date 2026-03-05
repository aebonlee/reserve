import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import SEOHead from '../../components/SEOHead';
import ScheduleForm from '../../components/schedule/ScheduleForm';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../utils/scheduleService';
import { getReservationsBySchedule } from '../../utils/reservationService';

const ScheduleManage = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const { user } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewReservations, setViewReservations] = useState(null);
  const [reservationsList, setReservationsList] = useState([]);

  useEffect(() => {
    loadSchedules();
  }, [year, month]);

  const loadSchedules = async () => {
    setLoading(true);
    const data = await getSchedules(year, month);
    setSchedules(data);
    setLoading(false);
  };

  const handleCreate = async (formData) => {
    try {
      await createSchedule({ ...formData, created_by: user?.id });
      addToast(t('admin.scheduleCreated'), 'success');
      setShowForm(false);
      loadSchedules();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateSchedule(editingSchedule.id, formData);
      addToast(t('admin.scheduleUpdated'), 'success');
      setEditingSchedule(null);
      setShowForm(false);
      loadSchedules();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    try {
      await deleteSchedule(id);
      addToast(t('admin.scheduleDeleted'), 'success');
      loadSchedules();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleViewReservations = async (scheduleId) => {
    if (viewReservations === scheduleId) {
      setViewReservations(null);
      return;
    }
    const data = await getReservationsBySchedule(scheduleId);
    setReservationsList(data);
    setViewReservations(scheduleId);
  };

  const handlePrevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (language === 'ko') return `${date.getMonth() + 1}/${date.getDate()}`;
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <SEOHead title={`${t('admin.manageSchedules')} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{t('admin.manageSchedules')}</h2>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-toolbar">
            <div className="admin-month-nav">
              <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <span className="admin-month-label">
                {language === 'ko' ? `${year}년 ${month}월` : new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' })}
              </span>
              <button className="calendar-nav-btn" onClick={handleNextMonth}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => { setEditingSchedule(null); setShowForm(true); }}>
              + {t('admin.addSchedule')}
            </button>
          </div>

          {(showForm || editingSchedule) && (
            <div className="admin-form-wrapper">
              <h3>{editingSchedule ? t('admin.editSchedule') : t('admin.addSchedule')}</h3>
              <ScheduleForm
                schedule={editingSchedule}
                onSubmit={editingSchedule ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditingSchedule(null); }}
              />
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="empty-state">
              <p>{t('schedule.noSchedules')}</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('schedule.date')}</th>
                    <th>{t('schedule.title')}</th>
                    <th>{t('schedule.time')}</th>
                    <th>{t('schedule.location')}</th>
                    <th>{t('schedule.capacity')}</th>
                    <th>{t('schedule.status')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <>
                      <tr key={s.id}>
                        <td>{formatDate(s.date)}</td>
                        <td className="td-title">{s.title}</td>
                        <td>{s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}</td>
                        <td>{s.location || '-'}</td>
                        <td>{s.current_count || 0}/{s.capacity || '-'}</td>
                        <td>
                          <span className={`td-badge ${s.status === 'open' ? 'green' : s.status === 'closed' ? 'yellow' : 'red'}`}>
                            {t(`schedule.status${s.status.charAt(0).toUpperCase() + s.status.slice(1)}`)}
                          </span>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button className="admin-row-btn" onClick={() => { setEditingSchedule(s); setShowForm(true); }}>
                              {t('common.edit')}
                            </button>
                            <button className="admin-row-btn" onClick={() => handleViewReservations(s.id)}>
                              {t('admin.viewReservations')}
                            </button>
                            <button className="admin-row-btn danger" onClick={() => handleDelete(s.id)}>
                              {t('common.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {viewReservations === s.id && (
                        <tr key={`res-${s.id}`} className="admin-expand-row">
                          <td colSpan="7">
                            <div className="admin-reservations-expand">
                              <h4>{t('admin.reservationList')} ({reservationsList.length})</h4>
                              {reservationsList.length === 0 ? (
                                <p className="text-secondary">{t('reservation.noReservations')}</p>
                              ) : (
                                <table className="admin-sub-table">
                                  <thead>
                                    <tr>
                                      <th>{t('reservation.name')}</th>
                                      <th>{t('reservation.email')}</th>
                                      <th>{t('reservation.phone')}</th>
                                      <th>{t('reservation.statusLabel')}</th>
                                      <th>{t('reservation.memo')}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {reservationsList.map(r => (
                                      <tr key={r.id}>
                                        <td>{r.user_name}</td>
                                        <td>{r.user_email}</td>
                                        <td>{r.user_phone || '-'}</td>
                                        <td>
                                          <span className={`td-badge ${r.status === 'confirmed' ? 'green' : 'red'}`}>
                                            {r.status === 'confirmed' ? t('reservation.confirmed') : t('reservation.cancelled')}
                                          </span>
                                        </td>
                                        <td>{r.memo || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ScheduleManage;
