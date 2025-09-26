create table public.trips (
    id uuid primary key default gen_random_uuid(),  -- 唯一 ID，自動生成
    title text not null,                            -- 行程名稱
    location text,                                  -- 地點
    dates text,                                     -- 日期範圍
    accommodation text,                             -- 住宿
    transport text,                                 -- 交通方式
    gear_renting text,                              -- 租借雪具/裝備
    notes text                                      -- 自由欄位
);