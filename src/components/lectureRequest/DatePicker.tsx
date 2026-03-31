import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getDailyScheduleHours } from '../../utils/scheduleService';
import type { DailyHoursMap } from '../../types';

const MAX_DAILY_HOURS = 5;

interface DatePickerProps {
  selectedDates?: string[];
  onChange: (dates: string[]) => void;
}

const DatePicker = ({ selectedDates = [], onChange }: DatePickerProps): React.ReactElement => {
  const { t, language } = useLanguage();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [dailyHours, setDailyHours] = useState<DailyHoursMap>({});

  useEffect(() => {
    const load = async (): Promise<void> => {
      const hours = await getDailyScheduleHours(year, month);
      setDailyHours(hours);
    };
    void load();
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const weekDays = language === 'ko'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthLabel = language === 'ko'
    ? `${year}년 ${month}월`
    : new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' });

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const handlePrev = (): void => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };

  const handleNext = (): void => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const toggleDate = (day: number): void => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateStr < todayStr) return;
    if ((dailyHours[dateStr] ?? 0) >= MAX_DAILY_HOURS) return;
    const next = selectedDates.includes(dateStr)
      ? selectedDates.filter(d => d !== dateStr)
      : [...selectedDates, dateStr].sort();
    onChange(next);
  };

  const removeDate = (dateStr: string): void => {
    onChange(selectedDates.filter(d => d !== dateStr));
  };

  const formatTag = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    if (language === 'ko') return `${d.getMonth() + 1}/${d.getDate()}`;
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const cells: React.ReactElement[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`e-${i}`} className="calendar-cell empty" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const isSelected = selectedDates.includes(dateStr);
    const isFull = (dailyHours[dateStr] ?? 0) >= MAX_DAILY_HOURS;

    cells.push(
      <div
        key={day}
        className={`calendar-cell${isPast ? ' past' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${isFull ? ' full' : ''}`}
        onClick={() => !isPast && !isFull && toggleDate(day)}
        title={isFull ? (language === 'ko' ? `${MAX_DAILY_HOURS}시간 이상 예약됨` : `${MAX_DAILY_HOURS}+ hours scheduled`) : ''}
      >
        {day}
        {isFull && <span className="calendar-full-dot" />}
      </div>
    );
  }

  return (
    <div className="lr-datepicker">
      <div className="calendar-header">
        <button type="button" className="calendar-nav-btn" onClick={handlePrev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="calendar-month-title">{monthLabel}</h3>
        <button type="button" className="calendar-nav-btn" onClick={handleNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekDays.map((d, i) => (
          <div key={i} className={`calendar-weekday${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>{d}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {cells}
      </div>
      <p className="lr-datepicker-hint">
        {t('lectureRequest.maxHoursHint')}
      </p>
      {selectedDates.length > 0 && (
        <div className="lr-selected-dates">
          {selectedDates.map(d => (
            <span key={d} className="lr-selected-date-tag">
              {formatTag(d)}
              <button type="button" onClick={() => removeDate(d)}>&times;</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
