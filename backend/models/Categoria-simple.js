const { query } = require('../config/database-simple');
const slugify = require('slugify');

class Categoria {
    // Listar todas
    static findAll() {
        return query.all('categorias').map(cat => ({
            ...cat,
            total_noticias: query.count('noticias', n => 
                n.categoria_id === cat.id && n.status === 'publicado'
            )
        }));
    }

    // Buscar por slug
    static findBySlug(slug) {
        return query.get('categorias', c => c.slug === slug);
    }

    // Buscar por ID
    static findById(id) {
        return query.get('categorias', c => c.id === parseInt(id));
    }

    // Criar categoria
    static create(data) {
        const slug = slugify(data.nome, { lower: true, strict: true });
        
        return query.insert('categorias', {
            nome: data.nome,
            slug,
            cor: data.cor || '#0ea5e9',
            descricao: data.descricao || null
        });
    }

    // Atualizar categoria
    static update(id, data) {
        const updateData = {};
        
        if (data.nome) {
            updateData.nome = data.nome;
            updateData.slug = slugify(data.nome, { lower: true, strict: true });
        }
        if (data.cor) updateData.cor = data.cor;
        if (data.descricao !== undefined) updateData.descricao = data.descricao;

        return query.update('categorias', id, updateData);
    }

    // Deletar categoria
    static delete(id) {
        return query.delete('categorias', id);
    }
}

module.exports = Categoria;
