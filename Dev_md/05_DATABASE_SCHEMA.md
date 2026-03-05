# 데이터베이스 스키마 문서

## 1. 개요

백엔드: **Supabase** (PostgreSQL)
인증: Supabase Auth (`auth.users`)

---

## 2. 테이블 목록

| 테이블 | 설명 | RLS |
|--------|------|-----|
| `schedules` | 강의 일정 | 활성화 |
| `reservations` | 예약 | 활성화 |
| `lecture_requests` | 강의 요청 | 활성화 |

---

## 3. lecture_requests 테이블

### 3.1 컬럼 정의

```sql
CREATE TABLE lecture_requests (
  -- PK
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 요청자 정보
  requester_name        TEXT NOT NULL,          -- 이름 (필수)
  requester_email       TEXT NOT NULL,          -- 이메일 (필수)
  requester_phone       TEXT,                   -- 전화번호
  requester_organization TEXT,                  -- 소속

  -- 강의 정보
  title                 TEXT NOT NULL,          -- 강의 제목 (필수)
  description           TEXT,                   -- 강의 내용 설명
  category              TEXT,                   -- 카테고리

  -- 희망 일정
  preferred_dates       TEXT[],                 -- 희망 날짜 배열 ['2026-03-10', '2026-03-15']
  date_range_start      DATE,                   -- 희망 기간 시작
  date_range_end        DATE,                   -- 희망 기간 종료
  date_notes            TEXT,                   -- 날짜 관련 메모
  preferred_start_time  TIME,                   -- 희망 시작 시간
  preferred_end_time    TIME,                   -- 희망 종료 시간
  preferred_location    TEXT,                   -- 희망 장소
  expected_participants INTEGER,                -- 예상 참가 인원

  -- 상태 관리
  status                TEXT DEFAULT 'pending'
                        CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes           TEXT,                   -- 관리자 메모 (반려 사유 등)
  reviewed_by           UUID REFERENCES auth.users(id), -- 검토 관리자
  reviewed_at           TIMESTAMPTZ,            -- 검토 일시
  created_schedule_id   UUID,                   -- 승인 시 생성된 일정 ID

  -- 타임스탬프
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 인덱스

```sql
CREATE INDEX idx_lecture_requests_status     ON lecture_requests(status);
CREATE INDEX idx_lecture_requests_created_at ON lecture_requests(created_at DESC);
CREATE INDEX idx_lecture_requests_email      ON lecture_requests(requester_email);
```

### 3.3 RLS 정책

```sql
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
```

---

## 4. schedules 테이블 (기존)

> 강의 요청 승인 시 이 테이블에 자동으로 레코드가 생성됨

```
id              UUID (PK)
title           TEXT
description     TEXT
date            DATE
start_time      TIME
end_time        TIME
location        TEXT
capacity        INTEGER
current_count   INTEGER (DEFAULT 0)
category        TEXT
status          TEXT ('open', 'closed', 'cancelled')
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

---

## 5. 관계도 (ER Diagram)

```
┌──────────────────┐       ┌──────────────────┐
│   auth.users     │       │    schedules     │
│──────────────────│       │──────────────────│
│ id (PK)          │◄──┐   │ id (PK)          │◄──┐
│ email            │   │   │ title            │   │
│ ...              │   │   │ date             │   │
└──────────────────┘   │   │ ...              │   │
                       │   └──────────────────┘   │
                       │                          │
┌──────────────────────┴──────────────────────────┴───┐
│                  lecture_requests                     │
│─────────────────────────────────────────────────────│
│ id (PK)                                              │
│ requester_name, requester_email, ...                 │
│ title, description, category                         │
│ preferred_dates[], date_range_start, date_range_end  │
│ status ('pending'/'approved'/'rejected')             │
│ reviewed_by ──────────► auth.users(id)               │
│ created_schedule_id ──► schedules(id)                │
│ created_at, updated_at                               │
└─────────────────────────────────────────────────────┘
```

---

## 6. SQL 스크립트 위치

```
프로젝트 루트/supabase/lecture_requests.sql
```

Supabase 대시보드 → SQL Editor에서 실행하면 테이블, RLS, 인덱스가 한 번에 생성됩니다.
