const { db } = require('../config/database');
const slugify = require('slugify');

class Noticia {
    // Listar todas as notícias (com filtros)
    static findAll(filters = {}) {
        let query = `
            SELECT 
                n.*,
                c.nome as categoria_nome,
                c.slug as categoria_slug,
                c.cor as categoria_cor,
                u.nome as autor_nome
            FROM noticias n
            LEFT JOIN categorias c ON n.categoria_id = c.id
            LEFT JOIN usuarios u ON n.autor_id = u.id
            WHERE 1=1
        `;
        
        const params = [];

        if (filters.status) {
            query += ' AND n.status = ?';
            params.push(filters.status);
        }

        if (filters.categoria) {
            query += ' AND c.slug = ?';
            params.push(filters.categoria);
        }

        if (filters.destaque) {
            query += ' AND n.destaque = 1';
        }

        if (filters.busca) {
            query += ' AND (n.titulo LIKE ? OR n.subtitulo LIKE ? OR n.conteudo LIKE ?)';
            const searchTerm = `%${filters.busca}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY n.created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
            
            if (filters.offset) {
                query += ' OFFSET ?';
                params.push(filters.offset);
            }
        }

        return db.prepare(query).all(...params);
    }

    // Buscar por slug
    static findBySlug(slug) {
        return db.prepare(`
            SELECT 
                n.*,
                c.nome as categoria_nome,
                c.slug as categoria_slug,
                c.cor as categoria_cor,
                u.nome as autor_nome
            FROM noticias n
            LEFT JOIN categorias c ON n.categoria_id = c.id
            LEFT JOIN usuarios u ON n.autor_id = u.id
            WHERE n.slug = ?
        `).get(slug);
    }

    // Buscar por ID
    static findById(id) {
        return db.prepare(`
            SELECT 
                n.*,
                c.nome as categoria_nome,
                c.slug as categoria_slug,
                u.nome as autor_nome
            FROM noticias n
            LEFT JOIN categorias c ON n.categoria_id = c.id
            LEFT JOIN usuarios u ON n.autor_id = u.id
            WHERE n.id = ?
        `).get(id);
    }

    // Criar notícia
    static create(data) {
        const slug = slugify(data.titulo, { lower: true, strict: true });
        
        const result = db.prepare(`
            INSERT INTO noticias (
                titulo, slug, subtitulo, conteudo, categoria_id, 
                autor_id, imagem_destaque, status, destaque, tempo_leitura,
                publicado_em
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            data.titulo,
            slug,
            data.subtitulo || null,
            data.conteudo,
            data.categoria_id,
            data.autor_id,
            data.imagem_destaque || null,
            data.status || 'rascunho',
            data.destaque ? 1 : 0,
            data.tempo_leitura || 5,
            data.status === 'publicado' ? new Date().toISOString() : null
        );

        return this.findById(result.lastInsertRowid);
    }

    // Atualizar notícia
    static update(id, data) {
        const slug = data.titulo ? slugify(data.titulo, { lower: true, strict: true }) : undefined;
        
        const fields = [];
        const params = [];

        if (data.titulo) {
            fields.push('titulo = ?', 'slug = ?');
            params.push(data.titulo, slug);
        }
        if (data.subtitulo !== undefined) {
            fields.push('subtitulo = ?');
            params.push(data.subtitulo);
        }
        if (data.conteudo) {
            fields.push('conteudo = ?');
            params.push(data.conteudo);
        }
        if (data.categoria_id) {
            fields.push('categoria_id = ?');
            params.push(data.categoria_id);
        }
        if (data.imagem_destaque !== undefined) {
            fields.push('imagem_destaque = ?');
            params.push(data.imagem_destaque);
        }
        if (data.status) {
            fields.push('status = ?');
            params.push(data.status);
            
            // Se mudou para publicado, atualizar data
            if (data.status === 'publicado') {
                fields.push('publicado_em = ?');
                params.push(new Date().toISOString());
            }
        }
        if (data.destaque !== undefined) {
            fields.push('destaque = ?');
            params.push(data.destaque ? 1 : 0);
        }
        if (data.tempo_leitura) {
            fields.push('tempo_leitura = ?');
            params.push(data.tempo_leitura);
        }

        fields.push('updated_at = ?');
        params.push(new Date().toISOString());
        params.push(id);

        db.prepare(`UPDATE noticias SET ${fields.join(', ')} WHERE id = ?`).run(...params);

        return this.findById(id);
    }

    // Deletar notícia
    static delete(id) {
        return db.prepare('DELETE FROM noticias WHERE id = ?').run(id);
    }

    // Incrementar visualizações
    static incrementViews(id) {
        db.prepare('UPDATE noticias SET views = views + 1 WHERE id = ?').run(id);
    }

    // Contar total
    static count(filters = {}) {
        let query = 'SELECT COUNT(*) as total FROM noticias WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        return db.prepare(query).get(...params).total;
    }

    // Notícias relacionadas
    static findRelated(id, categoriaId, limit = 3) {
        return db.prepare(`
            SELECT 
                n.*,
                c.nome as categoria_nome,
                c.slug as categoria_slug,
                c.cor as categoria_cor
            FROM noticias n
            LEFT JOIN categorias c ON n.categoria_id = c.id
            WHERE n.id != ? 
            AND n.categoria_id = ? 
            AND n.status = 'publicado'
            ORDER BY n.created_at DESC
            LIMIT ?
        `).all(id, categoriaId, limit);
    }
}

module.exports = Noticia;
