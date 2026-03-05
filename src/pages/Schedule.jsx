import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import CalendarView from '../components/schedule/CalendarView';
import ScheduleCard from '../components/schedule/ScheduleCard';
import { getSchedules } from '../utils/scheduleService';

const Schedule = () => {
  const { t } = useLanguage();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const [selectedDateSchedules, setSelectedDateSchedules] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getSchedules(year, month);
      setSchedules(data);
      setLoading(false);
    };
    load();
  }, [year, month]);

  const handleMonthChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDateSchedules(null);
    setSelectedDate(null);
  };

  const handleDateClick = (dateStr, daySchedules) => {
    setSelectedDate(dateStr);
    setSelectedDateSchedules(daySchedules);
  };

  const categories = ['all', ...new Set(schedules.map(s => s.category).filter(Boolean))];
  const filteredSchedules = categoryFilter === 'all'
    ? schedules
    : schedules.filter(s => s.category === categoryFilter);

  return (
    <>
      <SEOHead title={`${t('nav.schedule')} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{t('schedule.pageTitle')}</h2>
          <p>{t('schedule.pageSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* View Toggle & Filters */}
          <div className="schedule-toolbar">
            <div className="view-toggle">
              <button
                className={`view-toggle-btn${viewMode === 'calendar' ? ' active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {t('schedule.calendarView')}
              </button>
              <button
                className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                {t('schedule.listView')}
              </button>
            </div>
            {categories.length > 1 && (
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-filter-btn${categoryFilter === cat ? ' active' : ''}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === 'all' ? t('schedule.allCategories') : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : viewMode === 'calendar' ? (
            <div className="calendar-layout">
              <CalendarView
                schedules={filteredSchedules}
                year={year}
                month={month}
                onMonthChange={handleMonthChange}
                onDateClick={handleDateClick}
              />
              {selectedDateSchedules !== null && (
                <div className="calendar-day-schedules">
                  <h4>{selectedDate}</h4>
                  {selectedDateSchedules.length > 0 ? (
                    <div className="schedule-list">
                      {selectedDateSchedules.map(s => (
                        <ScheduleCard key={s.id} schedule={s} />
                      ))}
                    </div>
                  ) : (
                    <p className="no-schedules-text">{t('schedule.noSchedulesDay')}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="schedule-grid">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map(s => (
                  <ScheduleCard key={s.id} schedule={s} />
                ))
              ) : (
                <div className="empty-state">
                  <p>{t('schedule.noSchedules')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Schedule;
