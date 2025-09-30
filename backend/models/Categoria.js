const { db } = require('../config/database');
const slugify = require('slugify');

class Categoria {
    // Listar todas
    static findAll() {
        return db.prepare(`
            SELECT c.*, 
                   COUNT(n.id) as total_noticias
            FROM categorias c
            LEFT JOIN noticias n ON c.id = n.categoria_id AND n.status = 'publicado'
            GROUP BY c.id
            ORDER BY c.nome
        `).all();
    }

    // Buscar por slug
    static findBySlug(slug) {
        return db.prepare('SELECT * FROM categorias WHERE slug = ?').get(slug);
    }

    // Buscar por ID
    static findById(id) {
        return db.prepare('SELECT * FROM categorias WHERE id = ?').get(id);
    }

    // Criar categoria
    static create(data) {
        const slug = slugify(data.nome, { lower: true, strict: true });
        
        const result = db.prepare(`
            INSERT INTO categorias (nome, slug, cor, descricao) 
            VALUES (?, ?, ?, ?)
        `).run(
            data.nome,
            slug,
            data.cor || '#0ea5e9',
            data.descricao || null
        );

        return this.findById(result.lastInsertRowid);
    }

    // Atualizar categoria
    static update(id, data) {
        const slug = data.nome ? slugify(data.nome, { lower: true, strict: true }) : undefined;
        
        const fields = [];
        const params = [];

        if (data.nome) {
            fields.push('nome = ?', 'slug = ?');
            params.push(data.nome, slug);
        }
        if (data.cor) {
            fields.push('cor = ?');
            params.push(data.cor);
        }
        if (data.descricao !== undefined) {
            fields.push('descricao = ?');
            params.push(data.descricao);
        }

        params.push(id);

        db.prepare(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`).run(...params);

        return this.findById(id);
    }

    // Deletar categoria
    static delete(id) {
        return db.prepare('DELETE FROM categorias WHERE id = ?').run(id);
    }
}

module.exports = Categoria;
