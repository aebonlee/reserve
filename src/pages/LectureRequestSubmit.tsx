import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import LectureRequestForm from '../components/lectureRequest/LectureRequestForm';
import { submitLectureRequest } from '../utils/lectureRequestService';
import type { LectureRequestFormData } from '../types';

const LectureRequestSubmit = (): React.ReactElement => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: LectureRequestFormData): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      await submitLectureRequest(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEOHead title={t('lectureRequest.submitTitle')} />
        <section className="page-header">
          <div className="container"><h2>{t('lectureRequest.submitTitle')}</h2></div>
        </section>
        <section className="section">
          <div className="container">
            <div className="lr-success">
              <div className="lr-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>{t('lectureRequest.submitSuccess')}</h3>
              <p>{t('lectureRequest.submitSuccessDesc')}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>{t('lectureRequest.submitAnother')}</button>
                <Link to="/lecture-request" className="btn btn-secondary">{t('lectureRequest.backToList')}</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead title={t('lectureRequest.submitTitle')} />
      <section className="page-header">
        <div className="container">
          <h2>{t('lectureRequest.submitTitle')}</h2>
          <p>{t('lectureRequest.submitSubtitle')}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {error && (<div style={{ color: '#EF4444', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}
          <LectureRequestForm onSubmit={(data) => void handleSubmit(data)} loading={loading} />
        </div>
      </section>
    </>
  );
};

export default LectureRequestSubmit;
