-- ============================================
-- FIX FINAL: Ajustes finais no banco
-- ============================================

-- 1. Garantir que a tabela usuarios existe
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
    ativo BOOLEAN DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

-- RLS para usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for authenticated users" ON usuarios;
CREATE POLICY "Enable read for authenticated users" 
    ON usuarios 
    FOR SELECT 
    TO authenticated 
    USING (true);

DROP POLICY IF EXISTS "Enable all for authenticated users" ON usuarios;
CREATE POLICY "Enable all for authenticated users" 
    ON usuarios 
    FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- 2. Adicionar funções para gerar slugs nas notícias
DROP FUNCTION IF EXISTS generate_slug_from_titulo() CASCADE;

CREATE OR REPLACE FUNCTION generate_slug_from_titulo()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        -- Gerar slug base
        base_slug := regexp_replace(
            lower(
                unaccent(NEW.titulo)
            ),
            '[^a-z0-9]+', '-', 'g'
        );
        -- Remover hífens duplicados e do início/fim
        base_slug := regexp_replace(base_slug, '-+', '-', 'g');
        base_slug := trim(both '-' from base_slug);
        
        -- Verificar se existe e adicionar número se necessário
        final_slug := base_slug;
        WHILE EXISTS (SELECT 1 FROM noticias WHERE slug = final_slug AND id != COALESCE(NEW.id, 0)) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS generate_noticia_slug ON noticias;
CREATE TRIGGER generate_noticia_slug 
    BEFORE INSERT OR UPDATE ON noticias 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_slug_from_titulo();

-- 3. Instalar extensão unaccent se não existir
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================
-- ✅ PRONTO! Agora execute o seed novamente
-- ============================================
