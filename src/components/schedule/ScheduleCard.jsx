import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCategoryClass } from '../../utils/categories';

const ScheduleCard = ({ schedule }) => {
  const { t, language } = useLanguage();

  const statusLabels = {
    open: t('schedule.statusOpen'),
    closed: t('schedule.statusClosed'),
    cancelled: t('schedule.statusCancelled')
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (language === 'ko') {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.slice(0, 5);
  };

  const remaining = schedule.capacity > 0
    ? schedule.capacity - (schedule.current_count || 0)
    : null;

  return (
    <Link to={`/schedule/${schedule.id}`} className="schedule-card">
      <div className="schedule-card-header">
        <span className={`schedule-status status-${schedule.status}`}>
          {statusLabels[schedule.status] || schedule.status}
        </span>
        {schedule.category && (
          <span className={`schedule-category ${getCategoryClass(schedule.category)}`}>{schedule.category}</span>
        )}
      </div>
      <h4 className="schedule-card-title">{schedule.title}</h4>
      <div className="schedule-card-meta">
        <div className="schedule-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatDate(schedule.date)}</span>
        </div>
        <div className="schedule-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
        </div>
        {schedule.location && (
          <div className="schedule-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span>{schedule.location}</span>
          </div>
        )}
        {remaining !== null && (
          <div className="schedule-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{t('schedule.remaining')}: {remaining}/{schedule.capacity}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ScheduleCard;
