import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import SEOHead from '../../components/SEOHead';
import { getAllReservations, cancelReservation } from '../../utils/reservationService';

const ReservationManage = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    const data = await getAllReservations();
    setReservations(data);
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm(t('reservation.cancelConfirm'))) return;
    try {
      await cancelReservation(id);
      addToast(t('reservation.cancelSuccess'), 'success');
      loadReservations();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filtered = reservations
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.user_name?.toLowerCase().includes(s) ||
        r.user_email?.toLowerCase().includes(s) ||
        r.schedules?.title?.toLowerCase().includes(s)
      );
    });

  return (
    <>
      <SEOHead title={`${t('admin.manageReservations')} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{t('admin.manageReservations')}</h2>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-toolbar">
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
            <div className="admin-search">
              <input
                type="text"
                placeholder={t('admin.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>{t('reservation.noReservations')}</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('reservation.name')}</th>
                    <th>{t('reservation.email')}</th>
                    <th>{t('reservation.phone')}</th>
                    <th>{t('admin.scheduleName')}</th>
                    <th>{t('schedule.date')}</th>
                    <th>{t('reservation.statusLabel')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td className="td-title">{r.user_name}</td>
                      <td>{r.user_email}</td>
                      <td>{r.user_phone || '-'}</td>
                      <td>{r.schedules?.title || '-'}</td>
                      <td>{r.schedules?.date || '-'}</td>
                      <td>
                        <span className={`td-badge ${r.status === 'confirmed' ? 'green' : 'red'}`}>
                          {r.status === 'confirmed' ? t('reservation.confirmed') : t('reservation.cancelled')}
                        </span>
                      </td>
                      <td>
                        {r.status === 'confirmed' && (
                          <button className="admin-row-btn danger" onClick={() => handleCancel(r.id)}>
                            {t('reservation.cancel')}
                          </button>
                        )}
                      </td>
                    </tr>
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

export default ReservationManage;
