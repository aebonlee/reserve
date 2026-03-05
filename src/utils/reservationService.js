import getSupabase from './supabase';

/**
 * 예약 생성
 */
export const createReservation = async (scheduleId, userData) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('reservations')
    .insert({
      schedule_id: scheduleId,
      user_id: userData.user_id,
      user_name: userData.user_name,
      user_email: userData.user_email,
      user_phone: userData.user_phone || '',
      memo: userData.memo || '',
      status: 'confirmed'
    })
    .select()
    .single();

  if (error) throw error;

  // current_count 증가
  await client.rpc('increment_schedule_count', { schedule_id: scheduleId });

  return data;
};

/**
 * 예약 취소
 */
export const cancelReservation = async (id) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  // 예약 정보를 먼저 가져옴
  const { data: reservation } = await client
    .from('reservations')
    .select('schedule_id')
    .eq('id', id)
    .single();

  const { data, error } = await client
    .from('reservations')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // current_count 감소
  if (reservation) {
    await client.rpc('decrement_schedule_count', { schedule_id: reservation.schedule_id });
  }

  return data;
};

/**
 * 내 예약 목록
 */
export const getMyReservations = async (userId) => {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('reservations')
    .select('*, schedules(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getMyReservations error:', error);
    return [];
  }
  return data || [];
};

/**
 * 일정별 예약 (관리자)
 */
export const getReservationsBySchedule = async (scheduleId) => {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('reservations')
    .select('*')
    .eq('schedule_id', scheduleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getReservationsBySchedule error:', error);
    return [];
  }
  return data || [];
};

/**
 * 전체 예약 (관리자)
 */
export const getAllReservations = async () => {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('reservations')
    .select('*, schedules(title, date, start_time)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllReservations error:', error);
    return [];
  }
  return data || [];
};

/**
 * 예약 통계 (관리자)
 */
export const getReservationStats = async () => {
  const client = getSupabase();
  if (!client) return { total: 0, confirmed: 0, cancelled: 0 };

  const { data, error } = await client
    .from('reservations')
    .select('status');

  if (error) {
    console.error('getReservationStats error:', error);
    return { total: 0, confirmed: 0, cancelled: 0 };
  }

  const total = data?.length || 0;
  const confirmed = data?.filter(r => r.status === 'confirmed').length || 0;
  const cancelled = data?.filter(r => r.status === 'cancelled').length || 0;

  return { total, confirmed, cancelled };
};

/**
 * 특정 사용자가 특정 일정에 이미 예약했는지 확인
 */
export const checkExistingReservation = async (scheduleId, userId) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('reservations')
    .select('*')
    .eq('schedule_id', scheduleId)
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .limit(1);

  if (error) return null;
  return data && data.length > 0 ? data[0] : null;
};
