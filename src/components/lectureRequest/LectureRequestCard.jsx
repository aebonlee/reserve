import { useLanguage } from '../../contexts/LanguageContext';

const LectureRequestCard = ({ request, onClick }) => {
  const { t, language } = useLanguage();

  const statusLabels = {
    pending: t('lectureRequest.statusPending'),
    approved: t('lectureRequest.statusApproved'),
    rejected: t('lectureRequest.statusRejected')
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (language === 'ko') {
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    }
    return date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="lr-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="lr-card-header">
        <span className={`lr-status status-${request.status}`}>
          {statusLabels[request.status] || request.status}
        </span>
        {request.category && (
          <span className="schedule-category">{request.category}</span>
        )}
      </div>
      <h4 className="lr-card-title">{request.title}</h4>
      {request.description && (
        <p className="lr-card-desc">{request.description}</p>
      )}
      <div className="lr-card-meta">
        <div className="lr-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <span>{request.requester_name}</span>
          {request.requester_organization && (
            <span style={{ opacity: 0.7 }}>({request.requester_organization})</span>
          )}
        </div>
        {request.preferred_dates?.length > 0 && (
          <div className="lr-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>
              {request.preferred_dates.slice(0, 3).map(d => {
                const dt = new Date(d + 'T00:00:00');
                return language === 'ko'
                  ? `${dt.getMonth() + 1}/${dt.getDate()}`
                  : dt.toLocaleDateString('en', { month: 'short', day: 'numeric' });
              }).join(', ')}
              {request.preferred_dates.length > 3 && ` +${request.preferred_dates.length - 3}`}
            </span>
          </div>
        )}
        {request.preferred_location && (
          <div className="lr-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span>{request.preferred_location}</span>
          </div>
        )}
      </div>
      <div className="lr-card-footer">
        <span>{t('lectureRequest.requestDate')}: {formatDate(request.created_at)}</span>
        {request.requester_email && (
          <span>{request.requester_email}</span>
        )}
      </div>
    </div>
  );
};

export default LectureRequestCard;
