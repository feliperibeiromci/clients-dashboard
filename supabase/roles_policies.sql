-- Função auxiliar para obter o app_role do usuário atual
CREATE OR REPLACE FUNCTION public.get_app_role()
RETURNS text AS $$
DECLARE
  v_role text;
BEGIN
  SELECT app_role::text INTO v_role
  FROM public.clients
  WHERE id = auth.uid();
  return v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar Policies da tabela Projects

-- Remover policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Admins can do everything on projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their assigned projects" ON public.projects;

-- 1. Admins: Acesso Total
CREATE POLICY "Admins can do everything on projects"
  ON public.projects
  FOR ALL
  USING (public.is_admin());

-- 2. Viewers e Editors: SELECT (Visualizar) apenas projetos atribuídos
CREATE POLICY "Viewers and Editors can view assigned projects"
  ON public.projects
  FOR SELECT
  USING (
    id IN (
      SELECT project_id 
      FROM public.user_project_access 
      WHERE user_id = auth.uid()
    )
  );

-- 3. Editors: UPDATE (Editar) apenas projetos atribuídos
CREATE POLICY "Editors can update assigned projects"
  ON public.projects
  FOR UPDATE
  USING (
    public.get_app_role() = 'Editor' AND
    id IN (
      SELECT project_id 
      FROM public.user_project_access 
      WHERE user_id = auth.uid()
    )
  );

-- Atualizar Policies da tabela Clients (Users)
-- Apenas Admins devem poder Criar/Editar/Deletar outros usuários
-- Users normais podem apenas ver (talvez apenas a si mesmos, dependendo da regra)

DROP POLICY IF EXISTS "Admins can do everything on clients" ON public.clients;
DROP POLICY IF EXISTS "Clients can view their own record" ON public.clients;

CREATE POLICY "Admins can do everything on clients"
  ON public.clients
  FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view their own record"
  ON public.clients
  FOR SELECT
  USING (id = auth.uid());


