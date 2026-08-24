create table if not exists waitlist (
  id serial primary key,
  email text not null unique,
  handle text not null unique,
  referral_code text not null unique,
  referred_by_code text,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx on waitlist (created_at);
create index if not exists waitlist_referred_by_idx on waitlist (referred_by_code);
create index if not exists waitlist_handle_lower_idx on waitlist (lower(handle));

-- Seed so the board isn't empty on first paint. Fake emails never leave the server.
insert into waitlist (email, handle, referral_code, referred_by_code, created_at) values
  ('seed-01@sywbac.invalid', 'pixel.maya',   'MAYA8K2Q', null,        now() - interval '11 days'),
  ('seed-02@sywbac.invalid', 'lofi.jay',     'LOFI5R3P', null,        now() - interval '10 days'),
  ('seed-03@sywbac.invalid', 'aria.lifts',   'ARIA4T1M', null,        now() - interval '9 days'),
  ('seed-04@sywbac.invalid', 'dev.nori',     'NORI3W8K', 'MAYA8K2Q',  now() - interval '8 days'),
  ('seed-05@sywbac.invalid', 'kiran.eats',   'KIRN2Q7L', 'MAYA8K2Q',  now() - interval '8 days'),
  ('seed-06@sywbac.invalid', 'ruhi.money',   'RUHI9P4C', 'LOFI5R3P',  now() - interval '7 days'),
  ('seed-07@sywbac.invalid', 'clip.house',   'CLIP1D6S', 'MAYA8K2Q',  now() - interval '7 days'),
  ('seed-08@sywbac.invalid', 'jay.tilt',     'TILT8H2V', 'ARIA4T1M',  now() - interval '6 days'),
  ('seed-09@sywbac.invalid', 'studio.nori',  'STUD7B3N', 'MAYA8K2Q',  now() - interval '6 days'),
  ('seed-10@sywbac.invalid', 'dry.run',      'DRYN5K9F', 'LOFI5R3P',  now() - interval '5 days'),
  ('seed-11@sywbac.invalid', 'night.owl',    'NITE2M4X', 'MAYA8K2Q',  now() - interval '5 days'),
  ('seed-12@sywbac.invalid', 'reads.aria',   'READ6C1Z', 'ARIA4T1M',  now() - interval '4 days'),
  ('seed-13@sywbac.invalid', 'bean.theory',  'BEAN8L5Q', 'LOFI5R3P',  now() - interval '4 days'),
  ('seed-14@sywbac.invalid', 'hex.crafts',   'HEXC3P9W', 'MAYA8K2Q',  now() - interval '3 days'),
  ('seed-15@sywbac.invalid', 'slow.reps',    'SLOW4T7J', 'ARIA4T1M',  now() - interval '3 days'),
  ('seed-16@sywbac.invalid', 'film.dust',    'FILM1R8D', 'LOFI5R3P',  now() - interval '2 days'),
  ('seed-17@sywbac.invalid', 'tiny.hooks',   'TINY9G2B', 'MAYA8K2Q',  now() - interval '2 days'),
  ('seed-18@sywbac.invalid', 'oak.notes',    'OAKN5V3C', 'MAYA8K2Q',  now() - interval '36 hours'),
  ('seed-19@sywbac.invalid', 'mira.codes',   'MIRA2K8P', 'LOFI5R3P',  now() - interval '30 hours'),
  ('seed-20@sywbac.invalid', 'salt.studio',  'SALT7H1Q', 'ARIA4T1M',  now() - interval '24 hours'),
  ('seed-21@sywbac.invalid', 'orbit.kid',    'ORBT4N6S', 'LOFI5R3P',  now() - interval '18 hours'),
  ('seed-22@sywbac.invalid', 'plain.jane',   'PLAN8D2F', null,        now() - interval '12 hours'),
  ('seed-23@sywbac.invalid', 'vivid.sam',    'VIVD3C9K', 'ARIA4T1M',  now() - interval '8 hours'),
  ('seed-24@sywbac.invalid', 'north.loop',   'NRTH6W4M', null,        now() - interval '3 hours')
on conflict (email) do nothing;
