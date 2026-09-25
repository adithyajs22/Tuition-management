create table if not exists public.portal_state (
  id text primary key,
  students jsonb not null default '[]'::jsonb,
  attendance jsonb not null default '{}'::jsonb,
  fees jsonb not null default '{}'::jsonb,
  weekly_exams jsonb not null default '{}'::jsonb,
  student_syllabus jsonb not null default '{}'::jsonb,
  student_weekly_exams jsonb not null default '{}'::jsonb,
  portions jsonb not null default '[]'::jsonb,
  homework_notes jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portal_state
add column if not exists homework_notes jsonb not null default '{}'::jsonb;

alter table public.portal_state
add column if not exists student_syllabus jsonb not null default '{}'::jsonb;

alter table public.portal_state
add column if not exists student_weekly_exams jsonb not null default '{}'::jsonb;

insert into public.portal_state (id)
values ('main')
on conflict (id) do nothing;

alter table public.portal_state enable row level security;

drop policy if exists "Allow portal state reads" on public.portal_state;
drop policy if exists "Allow portal state writes" on public.portal_state;
drop policy if exists "Allow portal state updates" on public.portal_state;

create policy "Allow portal state reads"
on public.portal_state
for select
using (true);

create policy "Allow portal state writes"
on public.portal_state
for insert
with check (true);

create policy "Allow portal state updates"
on public.portal_state
for update
using (true)
with check (true);
