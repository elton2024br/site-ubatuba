const { query } = require('../config/database-simple');
const slugify = require('slugify');

class Noticia {
    // Listar todas as notícias (com filtros)
    static findAll(filters = {}) {
        let noticias = query.all('noticias');

        // Aplicar filtros
        if (filters.status) {
            noticias = noticias.filter(n => n.status === filters.status);
        }

        if (filters.categoria) {
            const categoria = query.get('categorias', c => c.slug === filters.categoria);
            if (categoria) {
                noticias = noticias.filter(n => n.categoria_id === categoria.id);
            }
        }

        if (filters.destaque) {
            noticias = noticias.filter(n => n.destaque === true);
        }

        if (filters.busca) {
            const searchLower = filters.busca.toLowerCase();
            noticias = noticias.filter(n => 
                n.titulo.toLowerCase().includes(searchLower) ||
                (n.subtitulo && n.subtitulo.toLowerCase().includes(searchLower)) ||
                n.conteudo.toLowerCase().includes(searchLower)
            );
        }

        // Ordenar por data
        noticias.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Paginação
        if (filters.limit) {
            const offset = filters.offset || 0;
            noticias = noticias.slice(offset, offset + filters.limit);
        }

        // Adicionar dados da categoria e autor
        return noticias.map(noticia => {
            const categoria = query.get('categorias', c => c.id === noticia.categoria_id);
            const autor = query.get('usuarios', u => u.id === noticia.autor_id);
            
            return {
                ...noticia,
                categoria_nome: categoria?.nome,
                categoria_slug: categoria?.slug,
                categoria_cor: categoria?.cor,
                autor_nome: autor?.nome || noticia.autor || 'Admin'
            };
        });
    }

    // Buscar por slug
    static findBySlug(slug) {
        const noticia = query.get('noticias', n => n.slug === slug);
        if (!noticia) return null;

        const categoria = query.get('categorias', c => c.id === noticia.categoria_id);
        const autor = query.get('usuarios', u => u.id === noticia.autor_id);

        return {
            ...noticia,
            categoria_nome: categoria?.nome,
            categoria_slug: categoria?.slug,
            categoria_cor: categoria?.cor,
            autor_nome: autor?.nome
        };
    }

    // Buscar por ID
    static findById(id) {
        const noticia = query.get('noticias', n => n.id === parseInt(id));
        if (!noticia) return null;

        const categoria = query.get('categorias', c => c.id === noticia.categoria_id);
        const autor = query.get('usuarios', u => u.id === noticia.autor_id);

        return {
            ...noticia,
            categoria_nome: categoria?.nome,
            categoria_slug: categoria?.slug,
            categoria_cor: categoria?.cor,
            autor_nome: autor?.nome || noticia.autor
        };
    }

    // Criar notícia
    static create(data) {
        const slug = slugify(data.titulo, { lower: true, strict: true });
        
        const newNoticia = query.insert('noticias', {
            titulo: data.titulo,
            slug,
            subtitulo: data.subtitulo || null,
            conteudo: data.conteudo,
            categoria_id: data.categoria_id,
            autor_id: data.autor_id || null,
            autor: data.autor || null,
            imagem_destaque: data.imagem_destaque || null,
            status: data.status || 'rascunho',
            destaque: data.destaque || false,
            views: 0,
            tempo_leitura: data.tempo_leitura || 5,
            data_publicacao: data.status === 'publicado' ? new Date().toISOString() : null,
            data_criacao: new Date().toISOString()
        });

        return this.findById(newNoticia.id);
    }

    // Atualizar notícia
    static update(id, data) {
        const updateData = {};

        if (data.titulo) {
            updateData.titulo = data.titulo;
            updateData.slug = slugify(data.titulo, { lower: true, strict: true });
        }
        if (data.subtitulo !== undefined) updateData.subtitulo = data.subtitulo;
        if (data.conteudo) updateData.conteudo = data.conteudo;
        if (data.categoria_id) updateData.categoria_id = data.categoria_id;
        if (data.imagem_destaque !== undefined) updateData.imagem_destaque = data.imagem_destaque;
        if (data.status) {
            updateData.status = data.status;
            if (data.status === 'publicado') {
                updateData.publicado_em = new Date().toISOString();
            }
        }
        if (data.destaque !== undefined) updateData.destaque = data.destaque;
        if (data.tempo_leitura) updateData.tempo_leitura = data.tempo_leitura;

        query.update('noticias', id, updateData);
        return this.findById(id);
    }

    // Deletar notícia
    static delete(id) {
        return query.delete('noticias', id);
    }

    // Incrementar visualizações
    static incrementViews(id) {
        const noticia = query.get('noticias', n => n.id === parseInt(id));
        if (noticia) {
            query.update('noticias', id, { views: (noticia.views || 0) + 1 });
        }
    }

    // Contar total
    static count(filters = {}) {
        let noticias = query.all('noticias');
        
        if (filters.status) {
            noticias = noticias.filter(n => n.status === filters.status);
        }
        
        return noticias.length;
    }

    // Notícias relacionadas
    static findRelated(id, categoriaId, limit = 3) {
        return query.all('noticias', n => 
            n.id !== parseInt(id) && 
            n.categoria_id === categoriaId && 
            n.status === 'publicado'
        )
        .slice(0, limit)
        .map(noticia => {
            const categoria = query.get('categorias', c => c.id === noticia.categoria_id);
            return {
                ...noticia,
                categoria_nome: categoria?.nome,
                categoria_slug: categoria?.slug,
                categoria_cor: categoria?.cor
            };
        });
    }
}

module.exports = Noticia;
