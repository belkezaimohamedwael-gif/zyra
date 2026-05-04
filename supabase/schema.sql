-- Products table
create table products (
  id bigint generated always as identity primary key,
  name text not null,
  price integer not null, -- in DA (Algerian Dinar), e.g. 6800
  category text not null check (category in ('Flats','Sandals','Boots','Mules','Heels')),
  tag text default '' check (tag in ('','New','Bestseller')),
  description text not null default '',
  colors text[] not null default '{}',
  img_urls text[] not null default '{}', -- array of image URLs, first one is main
  stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz default now()
);

-- Orders table
create table orders (
  id bigint generated always as identity primary key,
  order_num text not null unique,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  address text not null,
  wilaya text not null,
  city text not null,
  notes text,
  items jsonb not null, -- array of cart items
  total integer not null,
  status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz default now()
);

-- Admin users (use Supabase Auth, this just stores roles)
create table admin_users (
  id uuid references auth.users primary key,
  email text not null,
  created_at timestamptz default now()
);

-- Storage bucket for product images
-- Run this in Supabase dashboard: create bucket named "products" set to public

-- RLS Policies
alter table products enable row level security;
alter table orders enable row level security;
alter table admin_users enable row level security;

-- Products: public read, admin write
create policy "Public can read products" on products for select using (true);
create policy "Admins can manage products" on products for all
  using (auth.uid() in (select id from admin_users));

-- Orders: admin read/write only
create policy "Admins can manage orders" on orders for all
  using (auth.uid() in (select id from admin_users));

-- Admin users: each user can read their own record (avoids circular dependency)
create policy "Users can read their own admin record" on admin_users for select
  using (auth.uid() = id);
