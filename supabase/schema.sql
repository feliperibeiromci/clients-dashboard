-- Atualizar tabela clients para funcionar como tabela de Usuários do App
alter table public.clients add column if not exists phone text;
alter table public.clients drop column if exists metadata; -- Remover metadata antigo se não for usar, ou manter. Vou manter por segurança mas focar nas colunas planas.
-- A coluna 'role' já existe no tipo user_role, mas na tabela clients não tinha. 
-- Vamos adicionar uma coluna de role texto ou enum para o usuário da aplicação (não confundir com profile role de auth)
alter table public.clients add column if not exists app_role text default 'Viewer'; 

-- Create projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  company text not null,
  logo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on projects
alter table public.projects enable row level security;

-- Create policy for projects (Admins all, Clients read assigned?? For now Admins all)
create policy "Admins can do everything on projects" on public.projects
  for all using (public.is_admin());
  
create policy "Public read access for now" on public.projects
  for select using (true); -- Simplificar para dev

-- Create access table to link users (clients table) to projects
create table if not exists public.user_project_access (
  user_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, project_id)
);

-- Enable RLS
alter table public.user_project_access enable row level security;

create policy "Admins can manage access" on public.user_project_access
  for all using (public.is_admin());

-- Inserir dados iniciais de projetos (baseado nos mocks)
insert into public.projects (name, company, logo)
select 'Clio Marketing', 'Renault', 'renault'
where not exists (select 1 from public.projects where name = 'Clio Marketing');

insert into public.projects (name, company, logo)
select 'Tundra 2026', 'Toyota', 'toyota'
where not exists (select 1 from public.projects where name = 'Tundra 2026');

insert into public.projects (name, company, logo)
select 'New Civic', 'Honda', 'honda'
where not exists (select 1 from public.projects where name = 'New Civic');

insert into public.projects (name, company, logo)
select 'New Veloster Launch', 'Hyundai', 'hyundai'
where not exists (select 1 from public.projects where name = 'New Veloster Launch');

insert into public.projects (name, company, logo)
select 'Model S Campaign', 'Tesla', 'tesla'
where not exists (select 1 from public.projects where name = 'Model S Campaign');

insert into public.projects (name, company, logo)
select 'Mustang 2025', 'Ford', 'ford'
where not exists (select 1 from public.projects where name = 'Mustang 2025');

insert into public.projects (name, company, logo)
select '208 Launch', 'Peugeot', 'peugeot'
where not exists (select 1 from public.projects where name = '208 Launch');
