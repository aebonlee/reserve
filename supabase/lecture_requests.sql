-- ============================================
-- 강의 요청 게시판 테이블 생성
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS lecture_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 요청자 정보
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  requester_organization TEXT,

  -- 강의 정보
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,

  -- 희망 일정
  preferred_dates TEXT[],          -- 복수 희망 날짜 (YYYY-MM-DD 배열)
  date_range_start DATE,           -- 희망 기간 시작
  date_range_end DATE,             -- 희망 기간 끝
  date_notes TEXT,                 -- 날짜 관련 메모
  preferred_start_time TIME,       -- 희망 시작 시간
  preferred_end_time TIME,         -- 희망 종료 시간
  preferred_location TEXT,         -- 희망 장소
  expected_participants INTEGER,   -- 예상 참가 인원

  -- 상태 관리
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,                -- 관리자 메모
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_schedule_id UUID,        -- 승인 시 생성된 일정 ID

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS 활성화
ALTER TABLE lecture_requests ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책

-- 누구나 조회 가능
CREATE POLICY "lecture_requests_select_all"
  ON lecture_requests FOR SELECT
  USING (true);

-- 누구나 삽입 가능 (비로그인 포함)
CREATE POLICY "lecture_requests_insert_all"
  ON lecture_requests FOR INSERT
  WITH CHECK (true);

-- 인증된 사용자만 수정 가능
CREATE POLICY "lecture_requests_update_auth"
  ON lecture_requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 인증된 사용자만 삭제 가능
CREATE POLICY "lecture_requests_delete_auth"
  ON lecture_requests FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. 인덱스
CREATE INDEX idx_lecture_requests_status ON lecture_requests(status);
CREATE INDEX idx_lecture_requests_created_at ON lecture_requests(created_at DESC);
CREATE INDEX idx_lecture_requests_email ON lecture_requests(requester_email);
