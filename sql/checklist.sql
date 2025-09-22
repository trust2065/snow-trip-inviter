create table checklist (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null unique,
    data jsonb not null,          -- 整個 sections/options 的 JSON
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- how to make it real time?? so i can see in like web