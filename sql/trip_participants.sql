create table public.trip_participants (
    trip_id uuid not null references public.trips(id) on delete cascade,  -- 參考行程
    profile_id uuid not null references public.profiles(id) on delete cascade, -- 參考使用者
    primary key (trip_id, profile_id)
);