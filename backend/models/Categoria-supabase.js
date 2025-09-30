const { supabase } = require('../config/supabase');

class CategoriaSupabase {
    // Listar todas as categorias
    static async findAll() {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .order('nome');

        if (error) throw error;
        return data || [];
    }

    // Buscar por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Buscar por slug
    static async findBySlug(slug) {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Criar categoria
    static async create(categoriaData) {
        const { data, error } = await supabase
            .from('categorias')
            .insert([{
                nome: categoriaData.nome,
                cor: categoriaData.cor || '#0ea5e9',
                descricao: categoriaData.descricao
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Atualizar categoria
    static async update(id, categoriaData) {
        const updateData = {};

        if (categoriaData.nome !== undefined) updateData.nome = categoriaData.nome;
        if (categoriaData.cor !== undefined) updateData.cor = categoriaData.cor;
        if (categoriaData.descricao !== undefined) updateData.descricao = categoriaData.descricao;

        const { data, error } = await supabase
            .from('categorias')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Deletar categoria
    static async delete(id) {
        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}

module.exports = CategoriaSupabase;
