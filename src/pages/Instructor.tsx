import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const Instructor = (): React.ReactElement => {
  const { t } = useLanguage();

  const instructor = {
    name: t('instructor.name'),
    title: t('instructor.role'),
    image: null as string | null,
    bio: t('instructor.bio'),
    specialties: t('instructor.specialties').split(',').map(s => s.trim()),
    career: t('instructor.career').split('|').map(s => s.trim()),
    certifications: t('instructor.certifications').split('|').map(s => s.trim()),
    contact: {
      email: t('instructor.email'),
      phone: t('instructor.phone')
    }
  };

  return (
    <>
      <SEOHead title={t('instructor.pageTitle')} path="/instructor" />
      <section className="page-header">
        <div className="container">
          <h2>{t('instructor.pageTitle')}</h2>
          <p>{t('instructor.pageSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="instructor-profile">
            <div className="instructor-header">
              <div className="instructor-avatar">
                {instructor.image ? (
                  <img src={instructor.image} alt={instructor.name} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="instructor-info">
                <h3>{instructor.name}</h3>
                <span className="instructor-role">{instructor.title}</span>
                <p className="instructor-bio">{instructor.bio}</p>
              </div>
            </div>

            <div className="instructor-section">
              <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> {t('instructor.specialtiesTitle')}</h4>
              <div className="instructor-tags">{instructor.specialties.map((s, i) => (<span key={i} className="instructor-tag">{s}</span>))}</div>
            </div>

            <div className="instructor-section">
              <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> {t('instructor.careerTitle')}</h4>
              <ul className="instructor-list">{instructor.career.map((c, i) => (<li key={i}>{c}</li>))}</ul>
            </div>

            <div className="instructor-section">
              <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> {t('instructor.certificationsTitle')}</h4>
              <ul className="instructor-list">{instructor.certifications.map((c, i) => (<li key={i}>{c}</li>))}</ul>
            </div>

            <div className="instructor-section">
              <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> {t('instructor.contactTitle')}</h4>
              <div className="instructor-contact">
                {instructor.contact.email && (
                  <a href={`mailto:${instructor.contact.email}`} className="instructor-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    {instructor.contact.email}
                  </a>
                )}
                {instructor.contact.phone && (
                  <a href={`tel:${instructor.contact.phone}`} className="instructor-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    {instructor.contact.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Instructor;
