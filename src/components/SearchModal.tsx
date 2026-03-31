import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { searchAll } from '../utils/searchStorage';
import type { SearchResults, SearchResultItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps): React.ReactElement | null => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ blog: [], board: [], gallery: [] });
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ blog: [], board: [], gallery: [] });
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const doSearch = useCallback(async (q: string): Promise<void> => {
    if (!q.trim()) {
      setResults({ blog: [], board: [], gallery: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await searchAll(q);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void doSearch(val), 300);
  };

  const handleNavigate = (path: string): void => {
    onClose();
    navigate(path);
  };

  const totalResults = results.blog.length + results.board.length + results.gallery.length;
  const hasQuery = query.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder={t('search.placeholder')}
              value={query}
              onChange={handleChange}
            />
            <button className="search-close-btn" onClick={onClose}>ESC</button>
          </div>
        </div>

        <div className="search-modal-body">
          {loading && (
            <div className="search-loading">{t('search.searching')}</div>
          )}

          {!loading && hasQuery && totalResults === 0 && (
            <div className="search-empty">{t('search.noResults')}</div>
          )}

          {!loading && !hasQuery && (
            <div className="search-hint">{t('search.hint')}</div>
          )}

          {!loading && results.blog.length > 0 && (
            <div className="search-group">
              <h4 className="search-group-title">{t('search.blog')}</h4>
              {results.blog.map((item: SearchResultItem) => (
                <button
                  key={`blog-${item.id}`}
                  className="search-result-item"
                  onClick={() => handleNavigate(`/community/blog/${item.id}`)}
                >
                  <span className="search-result-type">Blog</span>
                  <div className="search-result-info">
                    <span className="search-result-title">
                      {language === 'en' ? (item.titleEn ?? item.title) : item.title}
                    </span>
                    <span className="search-result-meta">
                      {language === 'en' ? (item.categoryEn ?? item.category) : item.category} &middot; {item.date}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && results.board.length > 0 && (
            <div className="search-group">
              <h4 className="search-group-title">{t('search.board')}</h4>
              {results.board.map((item: SearchResultItem) => (
                <button
                  key={`board-${item.id}`}
                  className="search-result-item"
                  onClick={() => handleNavigate(`/community/board/${item.id}`)}
                >
                  <span className="search-result-type">Board</span>
                  <div className="search-result-info">
                    <span className="search-result-title">{item.title}</span>
                    <span className="search-result-meta">{item.author} &middot; {item.date}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && results.gallery.length > 0 && (
            <div className="search-group">
              <h4 className="search-group-title">{t('search.gallery')}</h4>
              {results.gallery.map((item: SearchResultItem) => (
                <button
                  key={`gallery-${item.id}`}
                  className="search-result-item"
                  onClick={() => handleNavigate('/community/gallery')}
                >
                  <span className="search-result-type">Gallery</span>
                  <div className="search-result-info">
                    <span className="search-result-title">
                      {language === 'en' ? (item.titleEn ?? item.title) : item.title}
                    </span>
                    <span className="search-result-meta">{item.date}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
