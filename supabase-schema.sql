-- ============================================================
-- Secure Lending Portal — Supabase Database Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- LOANS table
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  borrower_id text not null,
  borrower_name text not null,
  amount numeric not null,
  interest_rate numeric not null default 8.45,
  term_months integer not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','active','completed','defaulted')),
  total_payable numeric not null,
  remaining_balance numeric not null,
  next_payment_date timestamptz,
  application_date timestamptz not null default now(),
  approved_at timestamptz,
  monthly_emi numeric,
  details jsonb
);

-- PAYMENTS table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid references public.loans(id) on delete cascade,
  borrower_id text not null,
  amount numeric not null,
  due_date timestamptz not null,
  paid_date timestamptz,
  status text not null default 'scheduled'
    check (status in ('scheduled','paid','late','missed')),
  remarks text
);

-- NOTIFICATIONS table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  message text not null,
  type text not null default 'info'
    check (type in ('info','success','alert')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists idx_loans_borrower_id on public.loans(borrower_id);
create index if not exists idx_loans_status on public.loans(status);
create index if not exists idx_loans_application_date on public.loans(application_date desc);
create index if not exists idx_payments_loan_id on public.payments(loan_id);
create index if not exists idx_payments_borrower_id on public.payments(borrower_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);

-- ── Row Level Security ────────────────────────────────────────
-- Since this app uses a custom password-based admin auth (not Supabase Auth),
-- we use anon key with open RLS policies so the client can read/write.
-- For production, replace these with proper auth-based policies.

alter table public.loans enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;

-- Allow all operations via anon key (matches the app's custom admin auth model)
create policy "allow_all_loans" on public.loans for all using (true) with check (true);
create policy "allow_all_payments" on public.payments for all using (true) with check (true);
create policy "allow_all_notifications" on public.notifications for all using (true) with check (true);

-- ── Realtime ─────────────────────────────────────────────────
-- Enable realtime for all three tables
alter publication supabase_realtime add table public.loans;
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.notifications;
