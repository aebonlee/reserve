import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ReservationFormState, ReservationUserData } from '../../types';

interface ReservationFormProps {
  onSubmit: (data: ReservationUserData) => void;
  loading: boolean;
}

const ReservationForm = ({ onSubmit, loading }: ReservationFormProps): React.ReactElement => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<ReservationFormState>({
    user_name: '',
    user_email: '',
    user_phone: '',
    memo: ''
  });

  useEffect(() => {
    if (user || profile) {
      setForm(prev => ({
        ...prev,
        user_name: profile?.display_name ?? (user?.user_metadata as Record<string, unknown> | undefined)?.['full_name'] as string ?? '',
        user_email: profile?.email ?? user?.email ?? '',
        user_phone: profile?.phone ?? ''
      }));
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit({ ...form, user_id: user?.id ?? '' });
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('reservation.name')}</label>
        <input type="text" name="user_name" value={form.user_name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>{t('reservation.email')}</label>
        <input type="email" name="user_email" value={form.user_email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>{t('reservation.phone')}</label>
        <input type="tel" name="user_phone" value={form.user_phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>{t('reservation.memo')}</label>
        <textarea name="memo" value={form.memo} onChange={handleChange} rows={2} placeholder={t('reservation.memoPlaceholder')} />
      </div>
      <button type="submit" className="btn btn-primary reserve-submit-btn" disabled={loading}>
        {loading ? t('common.processing') : t('reservation.submit')}
      </button>
    </form>
  );
};

export default ReservationForm;
