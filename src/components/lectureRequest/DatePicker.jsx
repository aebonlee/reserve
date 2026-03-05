import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const DatePicker = ({ selectedDates = [], onChange }) => {
  const { language } = useLanguage();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const weekDays = language === 'ko'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthLabel = language === 'ko'
    ? `${year}년 ${month}월`
    : new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' });

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const handlePrev = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };

  const handleNext = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const toggleDate = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateStr < todayStr) return;
    const next = selectedDates.includes(dateStr)
      ? selectedDates.filter(d => d !== dateStr)
      : [...selectedDates, dateStr].sort();
    onChange(next);
  };

  const removeDate = (dateStr) => {
    onChange(selectedDates.filter(d => d !== dateStr));
  };

  const formatTag = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (language === 'ko') return `${d.getMonth() + 1}/${d.getDate()}`;
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`e-${i}`} className="calendar-cell empty" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const isSelected = selectedDates.includes(dateStr);

    cells.push(
      <div
        key={day}
        className={`calendar-cell${isPast ? ' past' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
        onClick={() => !isPast && toggleDate(day)}
      >
        {day}
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
