-- ============================================
-- Add DELETE policy for invites table
-- ============================================

-- Policy: Users can delete invites they created
CREATE POLICY "Users can delete own invites" ON public.invites
  FOR DELETE USING (invited_by = auth.uid());

-- Note: Admins can delete all invites through the "Admins can manage all invites" policy
-- which is created in the fix_rls_recursion migration

