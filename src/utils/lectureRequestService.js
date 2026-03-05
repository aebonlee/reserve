import getSupabase from './supabase';
import { createSchedule } from './scheduleService';

/**
 * 강의 요청 목록 조회
 */
export const getLectureRequests = async (statusFilter = null) => {
  const client = getSupabase();
  if (!client) return [];

  let query = client
    .from('lecture_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getLectureRequests error:', error);
    return [];
  }
  return data || [];
};

/**
 * 강의 요청 상세 조회
 */
export const getLectureRequestById = async (id) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('lecture_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getLectureRequestById error:', error);
    return null;
  }
  return data;
};

/**
 * 강의 요청 통계
 */
export const getLectureRequestStats = async () => {
  const client = getSupabase();
  if (!client) return { total: 0, pending: 0, approved: 0, rejected: 0 };

  const { data, error } = await client
    .from('lecture_requests')
    .select('status');

  if (error) {
    console.error('getLectureRequestStats error:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }

  const stats = { total: data.length, pending: 0, approved: 0, rejected: 0 };
  data.forEach(r => {
    if (stats[r.status] !== undefined) stats[r.status]++;
  });
  return stats;
};

/**
 * 강의 요청 제출 (비로그인)
 */
export const submitLectureRequest = async (formData) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('lecture_requests')
    .insert({
      requester_name: formData.requester_name,
      requester_email: formData.requester_email,
      requester_phone: formData.requester_phone || null,
      requester_organization: formData.requester_organization || null,
      title: formData.title,
      description: formData.description || null,
      category: formData.category || null,
      preferred_dates: formData.preferred_dates?.length > 0 ? formData.preferred_dates : null,
      date_range_start: formData.date_range_start || null,
      date_range_end: formData.date_range_end || null,
      date_notes: formData.date_notes || null,
      preferred_start_time: formData.preferred_start_time || null,
      preferred_end_time: formData.preferred_end_time || null,
      preferred_location: formData.preferred_location || null,
      expected_participants: formData.expected_participants || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * 강의 요청 승인 → 스케줄 자동 생성
 */
export const approveLectureRequest = async (id, scheduleData) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  // 1. 스케줄 생성
  const schedule = await createSchedule(scheduleData);

  // 2. 요청 상태 업데이트
  const { data: user } = await client.auth.getUser();

  const { error } = await client
    .from('lecture_requests')
    .update({
      status: 'approved',
      created_schedule_id: schedule.id,
      reviewed_by: user?.user?.id || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
  return schedule;
};

/**
 * 강의 요청 반려
 */
export const rejectLectureRequest = async (id, adminNotes) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: user } = await client.auth.getUser();

  const { error } = await client
    .from('lecture_requests')
    .update({
      status: 'rejected',
      admin_notes: adminNotes,
      reviewed_by: user?.user?.id || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};

/**
 * 강의 요청 삭제 (관리자)
 */
export const deleteLectureRequest = async (id) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('lecture_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
