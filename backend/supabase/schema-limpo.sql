-- ============================================
-- SCHEMA LIMPO - UBATUBA REAGE
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. LIMPAR TUDO (se houver conflitos)
DROP POLICY IF EXISTS "Permitir inserção pública em analytics" ON analytics;
DROP POLICY IF EXISTS "Permitir leitura de newsletter para autenticados" ON newsletter;
DROP POLICY IF EXISTS "Permitir inscrição pública na newsletter" ON newsletter;
DROP POLICY IF EXISTS "Permitir CRUD de categorias para autenticados" ON categorias;
DROP POLICY IF EXISTS "Permitir CRUD de notícias para autenticados" ON noticias;
DROP POLICY IF EXISTS "Permitir leitura pública de notícias publicadas" ON noticias;
DROP POLICY IF EXISTS "Permitir leitura pública de categorias" ON categorias;

DROP VIEW IF EXISTS noticias_completas CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS newsletter CASCADE;
DROP TABLE IF EXISTS noticias CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP FUNCTION IF EXISTS buscar_noticias(TEXT);
DROP FUNCTION IF EXISTS incrementar_views(INTEGER);
DROP FUNCTION IF EXISTS generate_slug_from_nome();
DROP FUNCTION IF EXISTS generate_slug_from_titulo();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 2. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. FUNÇÕES (criar antes das tabelas)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. CRIAR TABELAS

-- Tabela: usuarios
CREATE TABLE usuarios (
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

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);

-- Tabela: categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    cor VARCHAR(7) DEFAULT '#0ea5e9',
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categorias_slug ON categorias(slug);

-- Tabela: noticias
CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitulo VARCHAR(500),
    conteudo TEXT NOT NULL,
    resumo TEXT,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    autor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    autor VARCHAR(255),
    imagem_destaque TEXT,
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
    destaque BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    tempo_leitura INTEGER DEFAULT 5,
    data_publicacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_noticias_slug ON noticias(slug);
CREATE INDEX idx_noticias_status ON noticias(status);
CREATE INDEX idx_noticias_categoria ON noticias(categoria_id);
CREATE INDEX idx_noticias_autor ON noticias(autor_id);
CREATE INDEX idx_noticias_publicacao ON noticias(data_publicacao);

-- Tabela: newsletter
CREATE TABLE newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    confirmado BOOLEAN DEFAULT false,
    token_confirmacao VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_newsletter_email ON newsletter(email);

-- Tabela: analytics
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    noticia_id INTEGER REFERENCES noticias(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_noticia ON analytics(noticia_id);
CREATE INDEX idx_analytics_tipo ON analytics(tipo_evento);

-- 5. TRIGGERS
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at 
    BEFORE UPDATE ON categorias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_noticias_updated_at 
    BEFORE UPDATE ON noticias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at 
    BEFORE UPDATE ON newsletter 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Permitir leitura pública de categorias" 
    ON categorias FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de notícias publicadas" 
    ON noticias FOR SELECT USING (status = 'publicado' OR auth.role() = 'authenticated');

CREATE POLICY "Permitir CRUD de notícias para autenticados" 
    ON noticias FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir CRUD de categorias para autenticados" 
    ON categorias FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inscrição pública na newsletter" 
    ON newsletter FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de newsletter para autenticados" 
    ON newsletter FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção pública em analytics" 
    ON analytics FOR INSERT WITH CHECK (true);

-- 7. DADOS INICIAIS (SEED)
INSERT INTO categorias (nome, slug, cor) VALUES
('Cidade', 'cidade', '#0ea5e9'),
('Turismo', 'turismo', '#f59e0b'),
('Meio Ambiente', 'meio-ambiente', '#10b981'),
('Cultura', 'cultura', '#a855f7'),
('Praias', 'praias', '#3b82f6'),
('Esportes', 'esportes', '#ef4444')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ✅ CONCLUÍDO! 
-- Agora você pode testar a conexão
-- ============================================
