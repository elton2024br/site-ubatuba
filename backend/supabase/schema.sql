-- ============================================
-- SCHEMA DO BANCO DE DADOS - UBATUBA REAGE
-- Supabase PostgreSQL
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: usuarios
-- ============================================
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

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);

-- ============================================
-- TABELA: categorias
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    cor VARCHAR(7) DEFAULT '#0ea5e9',
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para categorias
CREATE INDEX idx_categorias_slug ON categorias(slug);

-- ============================================
-- TABELA: noticias
-- ============================================
CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitulo VARCHAR(500),
    conteudo TEXT NOT NULL,
    resumo TEXT,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    autor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    autor VARCHAR(255), -- Nome do autor (fallback)
    imagem_destaque TEXT,
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
    destaque BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    tempo_leitura INTEGER DEFAULT 5, -- em minutos
    data_publicacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para noticias
CREATE INDEX idx_noticias_slug ON noticias(slug);
CREATE INDEX idx_noticias_status ON noticias(status);
CREATE INDEX idx_noticias_categoria ON noticias(categoria_id);
CREATE INDEX idx_noticias_autor ON noticias(autor_id);
CREATE INDEX idx_noticias_publicacao ON noticias(data_publicacao);
CREATE INDEX idx_noticias_destaque ON noticias(destaque) WHERE destaque = true;

-- Full-text search para notícias
CREATE INDEX idx_noticias_search ON noticias USING gin(to_tsvector('portuguese', titulo || ' ' || COALESCE(subtitulo, '') || ' ' || conteudo));

-- ============================================
-- TABELA: newsletter
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    confirmado BOOLEAN DEFAULT false,
    token_confirmacao VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para newsletter
CREATE INDEX idx_newsletter_email ON newsletter(email);
CREATE INDEX idx_newsletter_confirmado ON newsletter(confirmado);

-- ============================================
-- TABELA: analytics
-- ============================================
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    noticia_id INTEGER REFERENCES noticias(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(50) NOT NULL, -- 'view', 'share', 'click'
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para analytics
CREATE INDEX idx_analytics_noticia ON analytics(noticia_id);
CREATE INDEX idx_analytics_tipo ON analytics(tipo_evento);
CREATE INDEX idx_analytics_created ON analytics(created_at);

-- ============================================
-- TRIGGERS: Atualizar updated_at automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON noticias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON newsletter FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGERS: Gerar slug automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION generate_slug_from_titulo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := regexp_replace(
            lower(
                translate(
                    NEW.titulo,
                    'áàãâäéèêëíìîïóòõôöúùûüçñ ',
                    'aaaaaeeeeiiiiooooouuuucn-'
                )
            ),
            '[^a-z0-9-]', '', 'g'
        );
        -- Remover hífens duplicados
        NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
        -- Remover hífen do início e fim
        NEW.slug := trim(both '-' from NEW.slug);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_noticia_slug BEFORE INSERT OR UPDATE ON noticias FOR EACH ROW EXECUTE FUNCTION generate_slug_from_titulo();

CREATE OR REPLACE FUNCTION generate_slug_from_nome()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := regexp_replace(
            lower(
                translate(
                    NEW.nome,
                    'áàãâäéèêëíìîïóòõôöúùûüçñ ',
                    'aaaaaeeeeiiiiooooouuuucn-'
                )
            ),
            '[^a-z0-9-]', '', 'g'
        );
        NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
        NEW.slug := trim(both '-' from NEW.slug);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_categoria_slug BEFORE INSERT OR UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION generate_slug_from_nome();

-- ============================================
-- VIEWS: Notícias com informações completas
-- ============================================

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
-- RLS (Row Level Security) - Segurança
-- ============================================

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Permitir leitura pública de categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de notícias publicadas" ON noticias FOR SELECT USING (status = 'publicado' OR auth.role() = 'authenticated');

-- Políticas para usuários autenticados
CREATE POLICY "Permitir CRUD de notícias para autenticados" ON noticias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir CRUD de categorias para autenticados" ON categorias FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter pode inserir publicamente
CREATE POLICY "Permitir inscrição pública na newsletter" ON newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de newsletter para autenticados" ON newsletter FOR SELECT USING (auth.role() = 'authenticated');

-- Analytics pode inserir publicamente
CREATE POLICY "Permitir inserção pública em analytics" ON analytics FOR INSERT WITH CHECK (true);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir categorias padrão
INSERT INTO categorias (nome, slug, cor) VALUES
('Cidade', 'cidade', '#0ea5e9'),
('Turismo', 'turismo', '#f59e0b'),
('Meio Ambiente', 'meio-ambiente', '#10b981'),
('Cultura', 'cultura', '#a855f7'),
('Praias', 'praias', '#3b82f6'),
('Esportes', 'esportes', '#ef4444')
ON CONFLICT (slug) DO NOTHING;

-- Inserir usuário admin (senha: admin123 - criptografada com bcrypt)
-- Nota: Você precisará executar isso manualmente com a senha criptografada
-- INSERT INTO usuarios (nome, email, senha, role) VALUES
-- ('Admin Ubatuba Reage', 'admin@ubatubareage.com.br', '$2a$10$...', 'admin');

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para incrementar views
CREATE OR REPLACE FUNCTION incrementar_views(noticia_id_param INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE noticias 
    SET views = views + 1 
    WHERE id = noticia_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para busca full-text
CREATE OR REPLACE FUNCTION buscar_noticias(termo_busca TEXT)
RETURNS TABLE (
    id INTEGER,
    titulo VARCHAR,
    subtitulo VARCHAR,
    slug VARCHAR,
    relevancia REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.titulo,
        n.subtitulo,
        n.slug,
        ts_rank(
            to_tsvector('portuguese', n.titulo || ' ' || COALESCE(n.subtitulo, '') || ' ' || n.conteudo),
            plainto_tsquery('portuguese', termo_busca)
        ) as relevancia
    FROM noticias n
    WHERE 
        n.status = 'publicado' AND
        to_tsvector('portuguese', n.titulo || ' ' || COALESCE(n.subtitulo, '') || ' ' || n.conteudo) @@ plainto_tsquery('portuguese', termo_busca)
    ORDER BY relevancia DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIM DO SCHEMA
-- ============================================
