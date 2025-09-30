const { supabase } = require('../config/supabase');

class NoticiaSupabase {
    // Listar todas as notícias (com filtros)
    static async findAll(filters = {}) {
        let query = supabase
            .from('noticias_completas')
            .select('*')
            .order('created_at', { ascending: false });

        // Aplicar filtros
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        if (filters.categoria) {
            query = query.eq('categoria_slug', filters.categoria);
        }

        if (filters.destaque) {
            query = query.eq('destaque', true);
        }

        if (filters.busca) {
            query = query.or(`titulo.ilike.%${filters.busca}%,subtitulo.ilike.%${filters.busca}%,conteudo.ilike.%${filters.busca}%`);
        }

        // Paginação
        if (filters.limit) {
            const offset = filters.offset || 0;
            query = query.range(offset, offset + filters.limit - 1);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    // Buscar por slug
    static async findBySlug(slug) {
        const { data, error } = await supabase
            .from('noticias_completas')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Buscar por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('noticias_completas')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Criar notícia
    static async create(noticiaData) {
        const { data, error } = await supabase
            .from('noticias')
            .insert([{
                titulo: noticiaData.titulo,
                subtitulo: noticiaData.subtitulo,
                conteudo: noticiaData.conteudo,
                categoria_id: noticiaData.categoria_id,
                autor_id: noticiaData.autor_id,
                autor: noticiaData.autor,
                imagem_destaque: noticiaData.imagem_destaque,
                status: noticiaData.status || 'rascunho',
                destaque: noticiaData.destaque || false,
                tempo_leitura: noticiaData.tempo_leitura || 5,
                data_publicacao: noticiaData.status === 'publicado' ? new Date().toISOString() : null
            }])
            .select()
            .single();

        if (error) throw error;
        
        // Retornar dados diretamente sem usar view (que pode não existir)
        return data;
    }

    // Atualizar notícia
    static async update(id, noticiaData) {
        const updateData = {};

        if (noticiaData.titulo !== undefined) updateData.titulo = noticiaData.titulo;
        if (noticiaData.subtitulo !== undefined) updateData.subtitulo = noticiaData.subtitulo;
        if (noticiaData.conteudo !== undefined) updateData.conteudo = noticiaData.conteudo;
        if (noticiaData.categoria_id !== undefined) updateData.categoria_id = noticiaData.categoria_id;
        if (noticiaData.autor !== undefined) updateData.autor = noticiaData.autor;
        if (noticiaData.imagem_destaque !== undefined) updateData.imagem_destaque = noticiaData.imagem_destaque;
        if (noticiaData.destaque !== undefined) updateData.destaque = noticiaData.destaque;
        if (noticiaData.tempo_leitura !== undefined) updateData.tempo_leitura = noticiaData.tempo_leitura;
        
        if (noticiaData.status !== undefined) {
            updateData.status = noticiaData.status;
            if (noticiaData.status === 'publicado') {
                updateData.data_publicacao = new Date().toISOString();
            }
        }

        const { data, error } = await supabase
            .from('noticias')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        
        // Retornar dados diretamente
        return data;
    }

    // Deletar notícia
    static async delete(id) {
        const { error } = await supabase
            .from('noticias')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // Incrementar visualizações
    static async incrementViews(id) {
        const { error } = await supabase.rpc('incrementar_views', {
            noticia_id_param: id
        });

        if (error) console.error('Erro ao incrementar views:', error);
    }

    // Contar total
    static async count(filters = {}) {
        let query = supabase
            .from('noticias')
            .select('*', { count: 'exact', head: true });

        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { count, error } = await query;

        if (error) throw error;
        return count || 0;
    }

    // Notícias relacionadas
    static async findRelated(id, categoriaId, limit = 3) {
        const { data, error } = await supabase
            .from('noticias_completas')
            .select('*')
            .eq('categoria_id', categoriaId)
            .eq('status', 'publicado')
            .neq('id', id)
            .limit(limit);

        if (error) throw error;
        return data || [];
    }

    // Busca full-text
    static async search(termo) {
        const { data, error } = await supabase.rpc('buscar_noticias', {
            termo_busca: termo
        });

        if (error) throw error;
        return data || [];
    }
}

module.exports = NoticiaSupabase;
