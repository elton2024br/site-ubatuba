-- ============================================
-- FIX: Criar/Ajustar tabela noticias e view
-- Execute este comando no Supabase SQL Editor
-- ============================================

-- Verificar e ajustar políticas de notícias
DROP POLICY IF EXISTS "Permitir leitura de notícias publicadas" ON noticias;
DROP POLICY IF EXISTS "Permitir tudo em notícias para autenticados" ON noticias;

CREATE POLICY "Enable read for all noticias" 
    ON noticias 
    FOR SELECT 
    TO anon, authenticated
    USING (true);

CREATE POLICY "Enable all for authenticated noticias" 
    ON noticias 
    FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Recriar view noticias_completas
DROP VIEW IF EXISTS noticias_completas CASCADE;

CREATE OR REPLACE VIEW noticias_completas AS
SELECT 
    n.*,
    c.nome as categoria_nome,
    c.slug as categoria_slug,
    c.cor as categoria_cor,
    COALESCE(u.nome, n.autor) as autor_nome,
    u.avatar_url as autor_avatar
FROM noticias n
LEFT JOIN categorias c ON n.categoria_id = c.id
LEFT JOIN usuarios u ON n.autor_id = u.id;

-- ============================================
-- ✅ PRONTO! Teste novamente
-- ============================================
