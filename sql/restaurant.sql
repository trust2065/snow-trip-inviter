create table restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  visited_date date,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);