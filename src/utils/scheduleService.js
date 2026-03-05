import getSupabase from './supabase';

/**
 * 월별 일정 조회
 */
export const getSchedules = async (year, month) => {
  const client = getSupabase();
  if (!client) return [];

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0);
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  const { data, error } = await client
    .from('schedules')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDateStr)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('getSchedules error:', error);
    return [];
  }
  return data || [];
};

/**
 * 일정 상세 조회
 */
export const getScheduleById = async (id) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getScheduleById error:', error);
    return null;
  }
  return data;
};

/**
 * 다가오는 일정 조회
 */
export const getUpcomingSchedules = async (limit = 4) => {
  const client = getSupabase();
  if (!client) return [];

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await client
    .from('schedules')
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
  return data || [];
};

/**
 * 일정 생성 (관리자)
 */
export const createSchedule = async (data) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: schedule, error } = await client
    .from('schedules')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return schedule;
};

/**
 * 일정 수정 (관리자)
 */
export const updateSchedule = async (id, data) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: schedule, error } = await client
    .from('schedules')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return schedule;
};

/**
 * 일정 삭제 (관리자)
 */
export const deleteSchedule = async (id) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
