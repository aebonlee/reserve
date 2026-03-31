import { useState, useEffect, Fragment } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import StatsCard from '../../components/admin/StatsCard';
import ScheduleForm from '../../components/schedule/ScheduleForm';
import {
  getLectureRequests,
  getLectureRequestStats,
  approveLectureRequest,
  rejectLectureRequest,
  deleteLectureRequest
} from '../../utils/lectureRequestService';
import type { LectureRequest, LectureRequestStats as LRStats, ScheduleFormData } from '../../types';

interface TableRowProps {
  req: LectureRequest;
  expanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  formatDate: (dateStr: string) => string;
  t: (key: string) => string;
  language: string;
}

const TableRow = ({ req, expanded, onToggle, onApprove, onReject, onDelete, formatDate, t, language }: TableRowProps): React.ReactElement => {
  const formatPreferredDates = (dates: string[] | null): string => {
    if (!dates?.length) return '-';
    return dates.map(d => {
      const dt = new Date(d + 'T00:00:00');
      return language === 'ko'
        ? `${dt.getMonth() + 1}/${dt.getDate()}`
        : dt.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    }).join(', ');
  };

  return (
    <Fragment>
      <tr className="lr-clickable-row" onClick={onToggle}>
        <td>
          <span className={`lr-status status-${req.status}`}>
            {req.status === 'pending' ? t('lectureRequest.statusPending')
              : req.status === 'approved' ? t('lectureRequest.statusApproved')
              : t('lectureRequest.statusRejected')}
          </span>
        </td>
        <td><strong>{req.title}</strong></td>
        <td>{req.requester_name}</td>
        <td>{req.requester_email}</td>
        <td>{formatDate(req.created_at)}</td>
      </tr>
      {expanded && (
        <tr className="lr-detail-row">
          <td colSpan={5}>
            <div className="lr-detail-content">
              <div className="lr-detail-grid">
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.requesterPhone')}</span>
                  <span className="lr-detail-value">{req.requester_phone ?? '-'}</span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.organization')}</span>
                  <span className="lr-detail-value">{req.requester_organization ?? '-'}</span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.category')}</span>
                  <span className="lr-detail-value">{req.category ?? '-'}</span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.participants')}</span>
                  <span className="lr-detail-value">{req.expected_participants ?? '-'}</span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.preferredDates')}</span>
                  <span className="lr-detail-value">{formatPreferredDates(req.preferred_dates)}</span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.dateRange')}</span>
                  <span className="lr-detail-value">
                    {req.date_range_start && req.date_range_end
                      ? `${req.date_range_start} ~ ${req.date_range_end}`
                      : '-'}
                  </span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.preferredTime')}</span>
                  <span className="lr-detail-value">
                    {req.preferred_start_time ?? req.preferred_end_time
                      ? `${req.preferred_start_time?.slice(0, 5) ?? ''} - ${req.preferred_end_time?.slice(0, 5) ?? ''}`
                      : '-'}
                  </span>
                </div>
                <div className="lr-detail-item">
                  <span className="lr-detail-label">{t('lectureRequest.preferredLocation')}</span>
                  <span className="lr-detail-value">{req.preferred_location ?? '-'}</span>
                </div>
              </div>

              {req.description && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="lr-detail-label">{t('lectureRequest.description')}</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                    {req.description}
                  </p>
                </div>
              )}

              {req.date_notes && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="lr-detail-label">{t('lectureRequest.dateNotes')}</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {req.date_notes}
                  </p>
                </div>
              )}

              {req.admin_notes && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="lr-detail-label">{t('lectureRequest.adminNotes')}</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {req.admin_notes}
                  </p>
                </div>
              )}

              {req.reviewed_at && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="lr-detail-label">{t('lectureRequest.reviewedAt')}</span>
                  <span className="lr-detail-value" style={{ marginLeft: '8px' }}>{formatDate(req.reviewed_at)}</span>
                </div>
              )}

              <div className="lr-detail-actions">
                {req.status === 'pending' && (
                  <>
                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); onApprove(); }}>
                      {t('lectureRequest.approve')}
                    </button>
                    <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); onReject(); }} style={{ color: '#EF4444' }}>
                      {t('lectureRequest.reject')}
                    </button>
                  </>
                )}
                <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ color: '#EF4444', marginLeft: 'auto' }}>
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
};

const LectureRequestManage = (): React.ReactElement => {
  const { t, language } = useLanguage();
  const [requests, setRequests] = useState<LectureRequest[]>([]);
  const [stats, setStats] = useState<LRStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<LectureRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<LectureRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    const [data, statsData] = await Promise.all([
      getLectureRequests(statusFilter),
      getLectureRequestStats()
    ]);
    setRequests(data);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => { void loadData(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (language === 'ko') return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
    return d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filtered = requests.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(s) ||
      r.requester_name?.toLowerCase().includes(s) ||
      r.requester_email?.toLowerCase().includes(s) ||
      r.requester_organization?.toLowerCase().includes(s)
    );
  });

  const handleApprove = async (scheduleData: ScheduleFormData): Promise<void> => {
    if (!approveTarget) return;
    setProcessing(true);
    try {
      const dates = (approveTarget.preferred_dates?.length ?? 0) > 0
        ? approveTarget.preferred_dates!
        : [scheduleData.date];
      const { date: _date, ...commonData } = scheduleData;
      await approveLectureRequest(approveTarget.id, { ...commonData, created_by: null }, dates.length > 0 ? dates : [scheduleData.date]);
      setApproveTarget(null);
      setExpandedId(null);
      await loadData();
    } catch (err) {
      console.error('Approve error:', err);
      alert((err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (): Promise<void> => {
    if (!rejectTarget) return;
    setProcessing(true);
    try {
      await rejectLectureRequest(rejectTarget.id, rejectReason);
      setRejectTarget(null);
      setRejectReason('');
      setExpandedId(null);
      await loadData();
    } catch (err) {
      console.error('Reject error:', err);
      alert((err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(t('lectureRequest.deleteConfirm'))) return;
    try {
      await deleteLectureRequest(id);
      setExpandedId(null);
      await loadData();
    } catch (err) {
      console.error('Delete error:', err);
      alert((err as Error).message);
    }
  };

  const filters = [
    { value: null as string | null, label: t('lectureRequest.statusAll'), count: stats.total },
    { value: 'pending' as string | null, label: t('lectureRequest.statusPending'), count: stats.pending },
    { value: 'approved' as string | null, label: t('lectureRequest.statusApproved'), count: stats.approved },
    { value: 'rejected' as string | null, label: t('lectureRequest.statusRejected'), count: stats.rejected }
  ];

  const buildPrefilledSchedule = (req: LectureRequest): ScheduleFormData => ({
    title: req.title ?? '',
    description: req.description ?? '',
    date: req.preferred_dates?.[0] ?? req.date_range_start ?? '',
    start_time: req.preferred_start_time?.slice(0, 5) ?? '',
    end_time: req.preferred_end_time?.slice(0, 5) ?? '',
    location: req.preferred_location ?? '',
    capacity: req.expected_participants ?? 0,
    category: req.category ?? '',
    status: 'open'
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={t('lectureRequest.adminManage')} />

      <section className="page-header">
        <div className="container">
          <h2>{t('lectureRequest.adminManage')}</h2>
          <p>{t('lectureRequest.adminManageDesc')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Stats */}
          <div className="admin-stats-grid" style={{ marginBottom: '32px' }}>
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
              label={t('lectureRequest.totalRequests')}
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
              label={t('lectureRequest.pendingRequests')}
              value={stats.pending}
              color="blue"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
              label={t('lectureRequest.approvedRequests')}
              value={stats.approved}
              color="green"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
              label={t('lectureRequest.rejectedRequests')}
              value={stats.rejected}
              color="red"
            />
          </div>

          {/* Filters & Search */}
          <div className="lr-toolbar">
            <div className="lr-filters">
              {filters.map(f => (
                <button
                  key={f.value ?? 'all'}
                  className={`lr-filter-btn${statusFilter === f.value ? ' active' : ''}`}
                  onClick={() => setStatusFilter(f.value)}
                >
                  {f.label}
                  <span className="lr-filter-count">({f.count})</span>
                </button>
              ))}
            </div>
            <div className="lr-admin-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={t('admin.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>{t('lectureRequest.noRequests')}</p>
            </div>
          ) : (
            <table className="lr-admin-table">
              <thead>
                <tr>
                  <th>{t('schedule.status')}</th>
                  <th>{t('lectureRequest.title')}</th>
                  <th>{t('lectureRequest.requesterName')}</th>
                  <th>{t('lectureRequest.requesterEmail')}</th>
                  <th>{t('lectureRequest.requestDate')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <TableRow
                    key={req.id}
                    req={req}
                    expanded={expandedId === req.id}
                    onToggle={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    onApprove={() => setApproveTarget(req)}
                    onReject={() => { setRejectTarget(req); setRejectReason(''); }}
                    onDelete={() => void handleDelete(req.id)}
                    formatDate={formatDate}
                    t={t}
                    language={language}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Approve Modal */}
      {approveTarget && (
        <div className="lr-modal-overlay" onClick={() => !processing && setApproveTarget(null)}>
          <div className="lr-modal" onClick={e => e.stopPropagation()}>
            <h3>{t('lectureRequest.approveTitle')}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {t('lectureRequest.approveDesc')}
            </p>
            {(approveTarget.preferred_dates?.length ?? 0) > 1 && (
              <div style={{ background: 'rgba(0,70,200,0.06)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '8px' }}>
                  {approveTarget.preferred_dates!.length}{t('lectureRequest.batchCreateNotice')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {approveTarget.preferred_dates!.map((d, i) => (
                    <span key={i} style={{ fontSize: '12px', padding: '3px 10px', background: 'rgba(0,70,200,0.1)', borderRadius: '12px', color: 'var(--primary-blue)' }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <ScheduleForm
              schedule={buildPrefilledSchedule(approveTarget)}
              onSubmit={(data) => void handleApprove(data)}
              onCancel={() => setApproveTarget(null)}
            />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="lr-modal-overlay" onClick={() => !processing && setRejectTarget(null)}>
          <div className="lr-modal" onClick={e => e.stopPropagation()}>
            <h3>{t('lectureRequest.rejectTitle')}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <strong>{rejectTarget.title}</strong> — {rejectTarget.requester_name}
            </p>
            <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
              {t('lectureRequest.rejectReason')}
            </label>
            <textarea
              className="lr-reject-textarea"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder={t('lectureRequest.rejectReasonPlaceholder')}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setRejectTarget(null)} disabled={processing}>
                {t('common.cancel')}
              </button>
              <button className="btn btn-primary" onClick={() => void handleReject()} disabled={processing} style={{ background: '#EF4444', borderColor: '#EF4444' }}>
                {processing ? t('common.processing') : t('lectureRequest.reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LectureRequestManage;
