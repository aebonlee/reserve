import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchModal from '../SearchModal';
import site from '../../config/site';
import type { ColorTheme, MenuItem } from '../../types';

interface ColorOptionLocal {
  name: ColorTheme;
  color: string;
}

const COLOR_OPTIONS: readonly ColorOptionLocal[] = [
  { name: 'blue', color: '#0046C8' },
  { name: 'red', color: '#C8102E' },
  { name: 'green', color: '#00855A' },
  { name: 'purple', color: '#8B1AC8' },
  { name: 'orange', color: '#C87200' },
];

const Navbar = (): React.ReactElement => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { mode, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isLoggedIn, isAdmin, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = (): void => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    setShowUserMenu(false);
  };

  // Filter menu items based on auth/admin status
  const menuItems: (MenuItem & { label: string })[] = site.menuItems
    .filter(item => {
      if (item.auth && !isLoggedIn) return false;
      if (item.admin && !isAdmin) return false;
      return true;
    })
    .map(item => ({
      ...item,
      label: t(item.labelKey)
    }));

  const isActive = (item: MenuItem): boolean => {
    const checkPath = item.activePath ?? item.path;
    if (checkPath === '/') return location.pathname === '/';
    return location.pathname.startsWith(checkPath);
  };

  const userInitial = (profile?.display_name ?? profile?.email ?? '?')[0]!.toUpperCase();

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <Link to="/">
              <h1>
                {site.brand.parts.map((part, i) => (
                  <span key={i} className={part.className}>
                    {part.text}
                  </span>
                ))}
              </h1>
            </Link>
          </div>

          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className={`nav-link ${isActive(item) ? 'active' : ''}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="nav-search-btn" onClick={() => setShowSearch(true)} aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button className="lang-switcher" onClick={toggleLanguage} aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}>
              {language === 'ko' ? 'EN' : 'KR'}
            </button>
            <div className="color-picker-wrapper">
              <button
                className="color-picker-btn"
                onClick={() => setShowColorPicker(!showColorPicker)}
                aria-label="Color theme"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="13.5" cy="6.5" r="2.5" style={{ fill: '#C8102E', stroke: 'none' }} />
                  <circle cx="17.5" cy="10.5" r="2.5" style={{ fill: '#C87200', stroke: 'none' }} />
                  <circle cx="8.5" cy="7.5" r="2.5" style={{ fill: '#00855A', stroke: 'none' }} />
                  <circle cx="6.5" cy="12" r="2.5" style={{ fill: '#0046C8', stroke: 'none' }} />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.24-.3-.39-.65-.39-1.04 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.5-9-10-9z" />
                </svg>
              </button>
              {showColorPicker && (
                <>
                  <div className="color-picker-overlay" onClick={() => setShowColorPicker(false)} />
                  <div className="color-picker-tooltip">
                    <div className="color-picker-arrow" />
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.name}
                        className={`color-dot${colorTheme === c.name ? ' active' : ''}`}
                        style={{ background: c.color }}
                        onClick={() => { setColorTheme(c.name); setShowColorPicker(false); }}
                        aria-label={`${c.name} theme`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="테마 전환" data-mode={mode}>
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg className="auto-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity="0.3" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              </svg>
            </button>
            {isLoggedIn ? (
              <div className="nav-user-menu" ref={userMenuRef}>
                <button className="nav-user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <span className="nav-user-avatar-placeholder">{userInitial}</span>
                </button>
                {showUserMenu && (
                  <div className="nav-user-dropdown">
                    <div className="dropdown-user-header">
                      <span className="dropdown-user-avatar">{userInitial}</span>
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">{profile?.display_name ?? ''}</span>
                        <span className="dropdown-user-email">{profile?.email ?? ''}</span>
                      </div>
                    </div>
                    <div className="divider" />
                    <Link to="/mypage" className="dropdown-menu-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {t('auth.myPage')}
                    </Link>
                    <Link to="/my-reservations" className="dropdown-menu-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {t('nav.myReservations')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                        {t('nav.admin')}
                      </Link>
                    )}
                    <div className="divider" />
                    <button onClick={() => void handleSignOut()} className="dropdown-menu-item logout">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      {t('auth.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn">{t('auth.login')}</Link>
            )}
            <button
              className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="메뉴 토글"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </nav>
  );
};

export default Navbar;
