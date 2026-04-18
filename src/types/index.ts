import type { SupabaseClient, User } from '@supabase/supabase-js';

/* ------------------------------------------------------------------ */
/*  Schedule                                                           */
/* ------------------------------------------------------------------ */
export interface Schedule {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  capacity: number;
  current_count: number;
  category: string | null;
  status: 'open' | 'closed' | 'cancelled';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ScheduleInsert = Omit<Schedule, 'id' | 'current_count' | 'created_at' | 'updated_at'>;
export type ScheduleUpdate = Partial<Omit<Schedule, 'id' | 'created_at'>>;

/* ------------------------------------------------------------------ */
/*  Reservation                                                        */
/* ------------------------------------------------------------------ */
export interface Reservation {
  id: string;
  schedule_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  memo: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  schedules?: Schedule | null;
}

export interface ReservationUserData {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  memo?: string;
}

export interface ReservationStats {
  total: number;
  confirmed: number;
  cancelled: number;
}

/* ------------------------------------------------------------------ */
/*  Lecture Request                                                     */
/* ------------------------------------------------------------------ */
export interface LectureRequest {
  id: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  requester_organization: string | null;
  title: string;
  description: string | null;
  category: string | null;
  preferred_dates: string[] | null;
  date_range_start: string | null;
  date_range_end: string | null;
  date_notes: string | null;
  preferred_start_time: string | null;
  preferred_end_time: string | null;
  preferred_location: string | null;
  expected_participants: number | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_schedule_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LectureRequestFormData {
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  requester_organization?: string;
  title: string;
  description?: string;
  category?: string;
  preferred_dates?: string[];
  date_range_start?: string;
  date_range_end?: string;
  date_notes?: string;
  preferred_start_time?: string;
  preferred_end_time?: string;
  preferred_location?: string;
  expected_participants?: number | null;
}

export interface LectureRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  [key: string]: number;
}

/* ------------------------------------------------------------------ */
/*  User / Member                                                      */
/* ------------------------------------------------------------------ */
export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'member' | 'admin' | 'user' | null;
  provider: string | null;
  signup_domain: string | null;
  visited_sites: string[] | null;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  name?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  signup_domain?: string;
  visited_sites?: string[];
  role?: string;
}

export interface MemberStats {
  total: number;
  members: number;
  admins: number;
}

/* ------------------------------------------------------------------ */
/*  Account Block                                                      */
/* ------------------------------------------------------------------ */
export interface AccountBlock {
  status: string;
  reason: string;
  suspended_until: string | null;
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */
export interface SearchResultItem {
  id: number;
  title: string;
  titleEn?: string;
  category?: string;
  categoryEn?: string;
  excerpt?: string;
  excerptEn?: string;
  description?: string;
  descriptionEn?: string;
  author?: string;
  date?: string;
  [key: string]: unknown;
}

export interface SearchResults {
  blog: SearchResultItem[];
  board: SearchResultItem[];
  gallery: SearchResultItem[];
}

/* ------------------------------------------------------------------ */
/*  Site Config                                                        */
/* ------------------------------------------------------------------ */
export interface BrandPart {
  text: string;
  className: string;
}

export interface MenuItem {
  path: string;
  labelKey: string;
  activePath?: string;
  auth?: boolean;
  admin?: boolean;
  label?: string;
}

export interface FooterLink {
  path: string;
  labelKey: string;
}

export interface SiteConfig {
  name: string;
  nameKo: string;
  description: string;
  url: string;
  brand: {
    parts: BrandPart[];
  };
  themeColor: string;
  menuItems: MenuItem[];
  footerLinks: FooterLink[];
}

/* ------------------------------------------------------------------ */
/*  Category                                                           */
/* ------------------------------------------------------------------ */
export interface Category {
  key: string;
  label: string;
  cssClass: string;
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/* ------------------------------------------------------------------ */
/*  Color theme                                                        */
/* ------------------------------------------------------------------ */
export type ThemeMode = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export type ColorTheme = 'blue' | 'red' | 'green' | 'purple' | 'orange';

export interface ColorOption {
  name: ColorTheme;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Schedule Form                                                      */
/* ------------------------------------------------------------------ */
export interface ScheduleFormData {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  category: string;
  status: 'open' | 'closed' | 'cancelled';
}

/* ------------------------------------------------------------------ */
/*  Reservation Form                                                   */
/* ------------------------------------------------------------------ */
export interface ReservationFormState {
  user_name: string;
  user_email: string;
  user_phone: string;
  memo: string;
}

/* ------------------------------------------------------------------ */
/*  Lecture Request Form State                                          */
/* ------------------------------------------------------------------ */
export interface LectureRequestFormState {
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  requester_organization: string;
  title: string;
  description: string;
  category: string;
  preferred_dates: string[];
  date_range_start: string;
  date_range_end: string;
  date_notes: string;
  preferred_start_time: string;
  preferred_end_time: string;
  preferred_location: string;
  expected_participants: string;
}

/* ------------------------------------------------------------------ */
/*  Daily Hours Map                                                    */
/* ------------------------------------------------------------------ */
export type DailyHoursMap = Record<string, number>;

/* ------------------------------------------------------------------ */
/*  Re-export Supabase types for convenience                           */
/* ------------------------------------------------------------------ */
export type { SupabaseClient, User };
