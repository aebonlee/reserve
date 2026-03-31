import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import site from '../../config/site';

const Footer = (): React.ReactElement => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              {site.brand.parts.map((part, i) => (
                <span key={i} className={part.className}>
                  {part.text}
                </span>
              ))}
            </h3>
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="footer-links">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              {site.footerLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{t(link.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-contact">
            <h4>{t('footer.contact')}</h4>
            <p>aebon@dreamitbiz.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Reserve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
