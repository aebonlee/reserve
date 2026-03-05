import getSupabase from './supabase';

/**
 * 현재 사이트 도메인으로 가입한 회원 목록 조회
 */
export const getSiteMembers = async () => {
  const client = getSupabase();
  if (!client) return [];

  const domain = window.location.hostname;

  const { data, error } = await client
    .from('user_profiles')
    .select('*')
    .eq('signup_domain', domain)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getSiteMembers error:', error);
    return [];
  }
  return data || [];
};

/**
 * 회원 통계
 */
export const getMemberStats = async () => {
  const members = await getSiteMembers();
  return {
    total: members.length,
    members: members.filter(m => m.role === 'member').length,
    admins: members.filter(m => m.role === 'admin').length,
  };
};
