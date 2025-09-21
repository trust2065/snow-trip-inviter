create table snowboards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  brand text,
  model text,
  length int,
  comment text,
  created_at timestamp default now()
);