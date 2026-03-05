import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CATEGORIES } from '../../utils/categories';
import DatePicker from './DatePicker';

const LectureRequestForm = ({ onSubmit, loading }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    requester_organization: '',
    title: '',
    description: '',
    category: '',
    preferred_dates: [],
    date_range_start: '',
    date_range_end: '',
    date_notes: '',
    preferred_start_time: '',
    preferred_end_time: '',
    preferred_location: '',
    expected_participants: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDatesChange = (dates) => {
    setForm(prev => ({ ...prev, preferred_dates: dates }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      expected_participants: form.expected_participants ? parseInt(form.expected_participants) : null
    });
  };

  return (
    <form className="lr-form" onSubmit={handleSubmit}>
      {/* 요청자 정보 */}
      <div className="form-section">
        <div className="form-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          {t('lectureRequest.sectionRequester')}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('lectureRequest.requesterName')} <span className="required">*</span></label>
            <input type="text" name="requester_name" value={form.requester_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('lectureRequest.requesterEmail')} <span className="required">*</span></label>
            <input type="email" name="requester_email" value={form.requester_email} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('lectureRequest.requesterPhone')}</label>
            <input type="tel" name="requester_phone" value={form.requester_phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('lectureRequest.requesterOrganization')}</label>
            <input type="text" name="requester_organization" value={form.requester_organization} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* 강의 정보 */}
      <div className="form-section">
        <div className="form-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {t('lectureRequest.sectionLecture')}
        </div>
        <div className="form-group">
          <label>{t('lectureRequest.title')} <span className="required">*</span></label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('lectureRequest.description')}</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('lectureRequest.category')}</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">{t('schedule.allCategories')}</option>
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{t('lectureRequest.expectedParticipants')}</label>
            <input type="number" name="expected_participants" value={form.expected_participants} onChange={handleChange} min="1" />
          </div>
        </div>
      </div>

      {/* 희망 일정 */}
      <div className="form-section">
        <div className="form-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {t('lectureRequest.sectionDate')}
        </div>

        <div className="form-group">
          <label>{t('lectureRequest.preferredDates')}</label>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '8px' }}>
            {t('lectureRequest.preferredDatesDesc')}
          </p>
          <DatePicker
            selectedDates={form.preferred_dates}
            onChange={handleDatesChange}
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>{t('lectureRequest.dateRange')}</label>
          <div className="lr-date-range">
            <input type="date" name="date_range_start" value={form.date_range_start} onChange={handleChange} />
            <span>~</span>
            <input type="date" name="date_range_end" value={form.date_range_end} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>{t('lectureRequest.dateNotes')}</label>
          <input type="text" name="date_notes" value={form.date_notes} onChange={handleChange} placeholder={t('lectureRequest.dateNotesPlaceholder')} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('lectureRequest.startTime')}</label>
            <input type="time" name="preferred_start_time" value={form.preferred_start_time} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('lectureRequest.endTime')}</label>
            <input type="time" name="preferred_end_time" value={form.preferred_end_time} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>{t('lectureRequest.preferredLocation')}</label>
          <input type="text" name="preferred_location" value={form.preferred_location} onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('lectureRequest.submitting') : t('lectureRequest.submit')}
        </button>
      </div>
    </form>
  );
};

export default LectureRequestForm;
