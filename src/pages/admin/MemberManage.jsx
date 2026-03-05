import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import StatsCard from '../../components/admin/StatsCard';
import { getSiteMembers } from '../../utils/userService';

const MemberManage = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getSiteMembers();
      setMembers(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = members.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (m.full_name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q)
    );
  });

  const totalCount = members.length;
  const memberCount = members.filter(m => m.role === 'member').length;
  const adminCount = members.filter(m => m.role === 'admin').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={`${t('admin.manageMembers')} | Reserve`} />

      <section className="page-header">
        <div className="container">
          <h2>{t('admin.manageMembers')}</h2>
          <p>{t('admin.manageMembersDesc')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-stats-grid">
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
              label={t('admin.totalMembers')}
              value={totalCount}
              color="blue"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
              label={t('admin.memberRole')}
              value={memberCount}
              color="green"
            />
            <StatsCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
              label={t('admin.adminRole')}
              value={adminCount}
              color="red"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder={t('admin.memberSearchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>{t('admin.noMembers')}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-manage-table">
                <thead>
                  <tr>
                    <th>{t('admin.memberName')}</th>
                    <th>{t('admin.memberEmail')}</th>
                    <th>{t('admin.memberRoleLabel')}</th>
                    <th>{t('admin.memberJoinDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.id}>
                      <td>{m.full_name || t('auth.noName')}</td>
                      <td>{m.email || '-'}</td>
                      <td>
                        <span className={`reservation-badge status-${m.role === 'admin' ? 'cancelled' : 'confirmed'}`}>
                          {m.role === 'admin' ? t('admin.adminRole') : t('admin.memberRole')}
                        </span>
                      </td>
                      <td>{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MemberManage;
