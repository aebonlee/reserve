import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CATEGORIES } from '../../utils/categories';
import type { ScheduleFormData, Schedule } from '../../types';

interface ScheduleFormProps {
  schedule?: Schedule | ScheduleFormData | null;
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
}

const ScheduleForm = ({ schedule, onSubmit, onCancel }: ScheduleFormProps): React.ReactElement => {
  const { t } = useLanguage();
  const [form, setForm] = useState<ScheduleFormData>({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    capacity: 0,
    category: '',
    status: 'open'
  });

  useEffect(() => {
    if (schedule) {
      setForm({
        title: schedule.title ?? '',
        description: schedule.description ?? '',
        date: schedule.date ?? '',
        start_time: schedule.start_time?.slice(0, 5) ?? '',
        end_time: schedule.end_time?.slice(0, 5) ?? '',
        location: schedule.location ?? '',
        capacity: schedule.capacity ?? 0,
        category: schedule.category ?? '',
        status: schedule.status ?? 'open'
      });
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    if (name === 'capacity') {
      setForm(prev => ({ ...prev, capacity: parseInt(value) || 0 }));
    } else if (name === 'status') {
      setForm(prev => ({ ...prev, status: value as ScheduleFormData['status'] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('schedule.title')}</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>{t('schedule.description')}</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>{t('schedule.date')}</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('schedule.startTime')}</label>
          <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('schedule.endTime')}</label>
          <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>{t('schedule.location')}</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>{t('schedule.capacity')}</label>
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min="0" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>{t('schedule.category')}</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">{t('schedule.allCategories')}</option>
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.label}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{t('schedule.status')}</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="open">{t('schedule.statusOpen')}</option>
            <option value="closed">{t('schedule.statusClosed')}</option>
            <option value="cancelled">{t('schedule.statusCancelled')}</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn btn-primary">
          {schedule ? t('common.save') : t('common.create')}
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;
