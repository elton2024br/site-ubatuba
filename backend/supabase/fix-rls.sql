-- ============================================
-- FIX: Ajustar políticas RLS
-- Execute este comando no Supabase SQL Editor
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir CRUD de categorias para autenticados" ON categorias;
DROP POLICY IF EXISTS "Permitir leitura pública de categorias" ON categorias;

-- Criar política mais permissiva para categorias (leitura pública)
CREATE POLICY "Permitir leitura pública de categorias" 
    ON categorias 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- Criar política para inserção/atualização por autenticados
CREATE POLICY "Permitir modificação de categorias para autenticados" 
    ON categorias 
    FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Atualizar política de notícias
DROP POLICY IF EXISTS "Permitir leitura pública de notícias publicadas" ON noticias;
DROP POLICY IF EXISTS "Permitir CRUD de notícias para autenticados" ON noticias;

CREATE POLICY "Permitir leitura de notícias publicadas" 
    ON noticias 
    FOR SELECT 
    TO anon, authenticated
    USING (status = 'publicado');

CREATE POLICY "Permitir tudo em notícias para autenticados" 
    ON noticias 
    FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Ajustar newsletter
DROP POLICY IF EXISTS "Permitir inscrição pública na newsletter" ON newsletter;
DROP POLICY IF EXISTS "Permitir leitura de newsletter para autenticados" ON newsletter;

CREATE POLICY "Permitir inscrição pública" 
    ON newsletter 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir leitura para autenticados" 
    ON newsletter 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Permitir modificação para autenticados" 
    ON newsletter 
    FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- ============================================
-- ✅ PRONTO! Agora teste novamente
-- ============================================
