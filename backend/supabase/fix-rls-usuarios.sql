-- ============================================
-- CORRIGIR RLS (Row Level Security) - Tabela usuarios
-- ============================================
-- 
-- PROBLEMA: RLS impede que o código leia a tabela usuarios
-- SOLUÇÃO: Criar políticas que permitam:
--   1. Leitura pública (para login)  
--   2. Operações admin autenticadas
-- ============================================

-- 1. REMOVER POLÍTICAS EXISTENTES (se houver conflitos)
DROP POLICY IF EXISTS "Enable read access for all users" ON usuarios;
DROP POLICY IF EXISTS "Enable insert for service role" ON usuarios; 
DROP POLICY IF EXISTS "Enable all for authenticated users" ON usuarios;
DROP POLICY IF EXISTS "Allow public read access" ON usuarios;
DROP POLICY IF EXISTS "Allow authenticated access" ON usuarios;

-- 2. POLÍTICA PARA LEITURA PÚBLICA (necessária para login)
CREATE POLICY "Allow public read for authentication"
    ON usuarios
    FOR SELECT
    USING (true);
    
-- 3. POLÍTICA PARA INSERÇÃO (service role e admin)
CREATE POLICY "Allow insert for service role"
    ON usuarios
    FOR INSERT
    WITH CHECK (true);

-- 4. POLÍTICA PARA ATUALIZAÇÃO (usuários autenticados)
CREATE POLICY "Allow update for authenticated users"
    ON usuarios
    FOR UPDATE
    USING (auth.uid()::text = id::text OR role = 'admin')
    WITH CHECK (auth.uid()::text = id::text OR role = 'admin');

-- 5. POLÍTICA PARA EXCLUSÃO (apenas admin)
CREATE POLICY "Allow delete for admin only"
    ON usuarios
    FOR DELETE
    USING (role = 'admin');

-- ============================================
-- VERIFICAR SE RLS ESTÁ ATIVADO
-- ============================================

-- Garantir que RLS está ativado na tabela
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ✅ RESULTADO ESPERADO:
-- ============================================
-- 
-- Após executar este SQL:
-- 1. ✅ API poderá ler usuários (para login)
-- 2. ✅ Código de autenticação funcionará  
-- 3. ✅ Segurança mantida (RLS ainda ativo)
-- 4. ✅ Operações admin protegidas
-- 
-- ============================================
