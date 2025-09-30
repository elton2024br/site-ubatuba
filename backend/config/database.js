const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'ubatuba_reage.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas se não existirem
function initDatabase() {
    // Tabela de usuários (admin/editores)
    db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'editor',
            ativo BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de categorias
    db.exec(`
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(50) NOT NULL UNIQUE,
            slug VARCHAR(50) NOT NULL UNIQUE,
            cor VARCHAR(20) DEFAULT '#0ea5e9',
            descricao TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de notícias
    db.exec(`
        CREATE TABLE IF NOT EXISTS noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            subtitulo TEXT,
            conteudo TEXT NOT NULL,
            categoria_id INTEGER,
            autor_id INTEGER,
            imagem_destaque VARCHAR(255),
            status VARCHAR(20) DEFAULT 'rascunho',
            destaque BOOLEAN DEFAULT 0,
            views INTEGER DEFAULT 0,
            tempo_leitura INTEGER DEFAULT 5,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            publicado_em DATETIME,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id),
            FOREIGN KEY (autor_id) REFERENCES usuarios(id)
        )
    `);

    // Tabela de newsletter
    db.exec(`
        CREATE TABLE IF NOT EXISTS newsletter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            confirmado BOOLEAN DEFAULT 0,
            token VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de comentários
    db.exec(`
        CREATE TABLE IF NOT EXISTS comentarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            noticia_id INTEGER NOT NULL,
            autor_nome VARCHAR(100) NOT NULL,
            autor_email VARCHAR(255),
            conteudo TEXT NOT NULL,
            aprovado BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE
        )
    `);

    // Tabela de analytics
    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            noticia_id INTEGER,
            tipo_evento VARCHAR(50) NOT NULL,
            ip_address VARCHAR(50),
            user_agent TEXT,
            referrer TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE
        )
    `);

    // Índices para performance
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_noticias_slug ON noticias(slug);
        CREATE INDEX IF NOT EXISTS idx_noticias_status ON noticias(status);
        CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON noticias(categoria_id);
        CREATE INDEX IF NOT EXISTS idx_noticias_created ON noticias(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_comentarios_noticia ON comentarios(noticia_id);
        CREATE INDEX IF NOT EXISTS idx_analytics_noticia ON analytics(noticia_id);
    `);

    console.log('✅ Banco de dados inicializado com sucesso!');
}

module.exports = { db, initDatabase };
