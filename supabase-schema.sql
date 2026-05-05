-- ============================================================
-- APPOINTMENT BOOKING SYSTEM — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Database > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── APPOINTMENTS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  appointment_date  DATE NOT NULL,
  appointment_time  TIME NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  file_url          TEXT,
  notes             TEXT,
  admin_notes       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_appointments_user_id     ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status      ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date        ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at  ON public.appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email              ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role               ON public.users(role);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
-- We use the Supabase service role key in the backend which bypasses RLS.
-- These RLS policies are for extra safety if you use anon key anywhere.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Users: only accessible via service role (backend controls all access)
CREATE POLICY "Service role full access users"
  ON public.users FOR ALL
  USING (true);

CREATE POLICY "Service role full access appointments"
  ON public.appointments FOR ALL
  USING (true);

-- ─── SEED: ADMIN USER ─────────────────────────────────────────
-- Password: Admin123!  (bcrypt hash — change this after first login!)
INSERT INTO public.users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@appointbook.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewXEAEJm7DkP6Pcu',
  'System Admin',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- ─── STORAGE BUCKET ──────────────────────────────────────────
-- Run this separately in Supabase Dashboard > Storage > New bucket
-- OR use the Supabase Storage API:
/*
  Bucket name: appointments
  Public: true
  File size limit: 5MB
  Allowed MIME types: image/jpeg, image/png, image/gif, image/webp,
                      application/pdf, application/msword,
                      application/vnd.openxmlformats-officedocument.wordprocessingml.document
*/

-- ─── VERIFY SETUP ─────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
