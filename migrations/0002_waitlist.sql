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

-- No seed rows: the public count and referral leaderboard must reflect real
-- signups only. A fresh environment starts with an empty board on purpose.
