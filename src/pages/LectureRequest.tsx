import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import LectureRequestCard from '../components/lectureRequest/LectureRequestCard';
import { getLectureRequests } from '../utils/lectureRequestService';
import type { LectureRequest as LectureRequestType } from '../types';

const LectureRequest = (): React.ReactElement => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<LectureRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      const data = await getLectureRequests(statusFilter);
      setRequests(data);
      setLoading(false);
    };
    void load();
  }, [statusFilter]);

  const filters = [
    { value: null, label: t('lectureRequest.statusAll') },
    { value: 'pending', label: t('lectureRequest.statusPending') },
    { value: 'approved', label: t('lectureRequest.statusApproved') },
    { value: 'rejected', label: t('lectureRequest.statusRejected') }
  ];

  return (
    <>
      <SEOHead title={t('lectureRequest.pageTitle')} />
      <section className="page-header">
        <div className="container">
          <h2>{t('lectureRequest.pageTitle')}</h2>
          <p>{t('lectureRequest.pageSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="lr-toolbar">
            <div className="lr-filters">
              {filters.map(f => (
                <button key={f.value ?? 'all'} className={`lr-filter-btn${statusFilter === f.value ? ' active' : ''}`} onClick={() => setStatusFilter(f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
            <Link to="/lecture-request/new" className="btn btn-primary">{t('lectureRequest.submitTitle')}</Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><div className="loading-spinner"></div></div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <p>{t('lectureRequest.noRequests')}</p>
              <Link to="/lecture-request/new" className="btn btn-primary">{t('lectureRequest.submitTitle')}</Link>
            </div>
          ) : (
            <div className="lr-grid">
              {requests.map(req => (<LectureRequestCard key={req.id} request={req} />))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LectureRequest;
