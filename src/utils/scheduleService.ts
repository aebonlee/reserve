import getSupabase from './supabase';
import type { Schedule, DailyHoursMap, ScheduleInsert, ScheduleUpdate } from '../types';

/**
 * 월별 일정 조회
 */
export const getSchedules = async (year: number, month: number): Promise<Schedule[]> => {
  const client = getSupabase();
  if (!client) return [];

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0);
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  const { data, error } = await client
    .from('rsv_schedules')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDateStr)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('getSchedules error:', error);
    return [];
  }
  return (data as Schedule[]) ?? [];
};

/**
 * 일정 상세 조회
 */
export const getScheduleById = async (id: string): Promise<Schedule | null> => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('rsv_schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getScheduleById error:', error);
    return null;
  }
  return data as Schedule;
};

/**
 * 다가오는 일정 조회
 */
export const getUpcomingSchedules = async (limit: number = 4): Promise<Schedule[]> => {
  const client = getSupabase();
  if (!client) return [];

  const today = new Date().toISOString().split('T')[0]!;

  const { data, error } = await client
    .from('rsv_schedules')
    .select('*')
    .gte('date', today)
    .eq('status', 'open')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getUpcomingSchedules error:', error);
    return [];
  }
  return (data as Schedule[]) ?? [];
};

/**
 * 날짜별 총 강의 시간(시간 단위) 계산
 * 반환: { '2026-03-06': 6.5, '2026-03-13': 3, ... }
 */
export const getDailyScheduleHours = async (year: number, month: number): Promise<DailyHoursMap> => {
  const schedules = await getSchedules(year, month);
  const hours: DailyHoursMap = {};

  schedules.forEach(s => {
    if (!s.date || !s.start_time || !s.end_time) return;
    const [sh, sm] = s.start_time.split(':').map(Number);
    const [eh, em] = s.end_time.split(':').map(Number);
    if (sh === undefined || sm === undefined || eh === undefined || em === undefined) return;
    const duration = (eh + em / 60) - (sh + sm / 60);
    if (duration > 0) {
      hours[s.date] = (hours[s.date] ?? 0) + duration;
    }
  });

  return hours;
};

/**
 * 특정 날짜의 총 강의 시간 조회
 */
export const getDateTotalHours = async (dateStr: string): Promise<number> => {
  const [yearStr, monthStr] = dateStr.split('-');
  if (!yearStr || !monthStr) return 0;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const hours = await getDailyScheduleHours(year, month);
  return hours[dateStr] ?? 0;
};

/**
 * 일정 생성 (관리자)
 */
export const createSchedule = async (data: ScheduleInsert): Promise<Schedule> => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: schedule, error } = await client
    .from('rsv_schedules')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return schedule as Schedule;
};

/**
 * 일정 수정 (관리자)
 */
export const updateSchedule = async (id: string, data: ScheduleUpdate): Promise<Schedule> => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: schedule, error } = await client
    .from('rsv_schedules')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return schedule as Schedule;
};

/**
 * 일정 삭제 (관리자)
 */
export const deleteSchedule = async (id: string): Promise<void> => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('rsv_schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
