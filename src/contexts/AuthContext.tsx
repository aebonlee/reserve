import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import getSupabase, { setSharedSession, getSharedSession, clearSharedSession } from '../utils/supabase';
import { getProfile, updateProfile, signOut as authSignOut } from '../utils/auth';
import { ADMIN_EMAILS } from '../config/admin';
import type { UserProfile, AccountBlock } from '../types';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  accountBlock: AccountBlock | null;
  clearAccountBlock: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountBlock, setAccountBlock] = useState<AccountBlock | null>(null);

  const loadProfile = useCallback(async (authUser: User) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const p = await getProfile(authUser.id);
    // signup_domain 또는 role이 미설정이면 자동 초기화
    if (p) {
      const updates: Record<string, unknown> = {};
      const currentDomain = window.location.hostname;
      if (!p.signup_domain) updates['signup_domain'] = currentDomain;
      // 현재 도메인이 visited_sites에 없으면 자동 추가
      const sites = Array.isArray(p.visited_sites) ? p.visited_sites : [];
      if (!sites.includes(currentDomain)) {
        updates['visited_sites'] = [...sites, currentDomain];
      }
      if (!p.role || p.role === 'user') updates['role'] = 'member';
      if (Object.keys(updates).length > 0) {
        try {
          const updated = await updateProfile(authUser.id, updates);
          setProfile(updated);
        } catch {
          setProfile(p);
        }
      } else {
        setProfile(p);
      }
    }

    // 계정 상태 체크
    try {
      const client = getSupabase();
      if (client) {
        const { data: statusData } = await client.rpc('check_user_status', {
          target_user_id: authUser.id,
          current_domain: window.location.hostname,
        });
        const status = statusData as { status?: string; reason?: string; suspended_until?: string } | null;
        if (status && status.status && status.status !== 'active') {
          setAccountBlock({
            status: status.status,
            reason: status.reason ?? '',
            suspended_until: status.suspended_until ?? null,
          });
          await authSignOut();
          setUser(null);
          setProfile(null);
          return;
        }
      }
    } catch {
      // check_user_status 함수 미존재 시 무시
    }
  }, []);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }

    // onAuthStateChange 하나로 통합 — INITIAL_SESSION은 OAuth 코드 교환 완료 후 발생
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        void loadProfile(u);
        // 로그인 시 last_sign_in_at 업데이트
        if (event === 'SIGNED_IN') {
          void client.from('user_profiles')
            .update({ last_sign_in_at: new Date().toISOString() })
            .eq('id', u.id)
            .then(() => {});
        }
      } else {
        setProfile(null);
      }
      // SSO: INITIAL_SESSION에서 세션 없으면 공유 쿠키로 복원
      if (event === 'INITIAL_SESSION') {
        if (!session) {
          const rt = getSharedSession();
          if (rt) {
            try {
              const { data } = await client.auth.refreshSession({ refresh_token: rt });
              if (!data.session) clearSharedSession();
            } catch { clearSharedSession(); }
          }
        }
        setLoading(false);
      }

      // SSO: 쿠키 동기화
      if (session?.refresh_token) setSharedSession(session.refresh_token);
      if (event === 'SIGNED_OUT') clearSharedSession();
    });

    // 안전장치: INITIAL_SESSION이 5초 내 안 오면 loading 해제
    const fallbackTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn('Auth: INITIAL_SESSION timeout, forcing loading=false');
        return false;
      });
    }, 5000);


  // 10분 무동작 세션 타임아웃
  useIdleTimeout({
    enabled: isLoggedIn,
    onTimeout: () => {
      authSignOut().catch(() => {});
      clearSharedSession();
    },
  });

    return () => {
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async (): Promise<void> => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  const allEmails = [
    user?.email,
    (user?.user_metadata as Record<string, unknown> | undefined)?.['email'] as string | undefined,
    (user?.identities?.[0]?.identity_data as Record<string, unknown> | undefined)?.['email'] as string | undefined,
    profile?.email,
  ].filter((e): e is string => Boolean(e)).map((e) => e.toLowerCase());
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e));
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isLoggedIn,
      isAdmin,
      signOut,
      refreshProfile,
      accountBlock,
      clearAccountBlock: () => setAccountBlock(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
