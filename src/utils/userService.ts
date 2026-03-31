import getSupabase from './supabase';
import type { UserProfile, MemberStats } from '../types';

/**
 * 현재 사이트 도메인으로 가입한 회원 목록 조회
 */
export const getSiteMembers = async (): Promise<UserProfile[]> => {
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
  return (data as UserProfile[]) ?? [];
};

/**
 * 회원 통계
 */
export const getMemberStats = async (): Promise<MemberStats> => {
  const members = await getSiteMembers();
  return {
    total: members.length,
    members: members.filter(m => m.role === 'member').length,
    admins: members.filter(m => m.role === 'admin').length,
  };
};
