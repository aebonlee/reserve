import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCategoryClass } from '../../utils/categories';
import type { Schedule, DailyHoursMap } from '../../types';

interface CalendarViewProps {
  schedules?: Schedule[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  onDateClick?: (dateStr: string, schedules: Schedule[]) => void;
  dailyHours?: DailyHoursMap;
}

const CalendarView = ({ schedules = [], year, month, onMonthChange, onDateClick, dailyHours = {} }: CalendarViewProps): React.ReactElement => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const weekDays = language === 'ko'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthNames = language === 'ko'
    ? [`${year}년 ${month}월`]
    : [new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' })];

  const scheduleDates: Record<string, Schedule[]> = {};
  schedules.forEach(s => {
    const d = s.date;
    if (!scheduleDates[d]) scheduleDates[d] = [];
    scheduleDates[d]!.push(s);
  });

  const handlePrev = (): void => {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    onMonthChange(newYear, newMonth);
  };

  const handleNext = (): void => {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    onMonthChange(newYear, newMonth);
  };

  const handleDateClick = (day: number): void => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    if (onDateClick) onDateClick(dateStr, scheduleDates[dateStr] ?? []);
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells: React.ReactElement[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySchedules = scheduleDates[dateStr];
    const hasSchedule = daySchedules && daySchedules.length > 0;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    const isDateFull = (dailyHours[dateStr] ?? 0) >= 5;

    cells.push(
      <div
        key={day}
        className={`calendar-cell${hasSchedule ? ' has-schedule' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${isDateFull ? ' date-full' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <span className="calendar-day">{day}</span>
        {hasSchedule && (
          <div className="calendar-dots">
            {daySchedules.slice(0, 3).map((s, i) => (
              <span key={i} className={`calendar-dot-marker ${getCategoryClass(s.category ?? '')} status-${s.status}`} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="calendar-month-title">{monthNames[0]}</h3>
        <button className="calendar-nav-btn" onClick={handleNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekDays.map((day, i) => (
          <div key={i} className={`calendar-weekday${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {cells}
      </div>
    </div>
  );
};

export default CalendarView;
