const { supabase } = require('../config/supabase');

class UsuarioSupabase {
    // Listar todos os usuários
    static async findAll() {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome, email, role, ativo, avatar_url, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Buscar por email
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Buscar por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome, email, role, ativo, avatar_url, created_at')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Criar usuário
    static async create(usuarioData) {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{
                nome: usuarioData.nome,
                email: usuarioData.email,
                senha: usuarioData.senha,
                role: usuarioData.role || 'editor',
                ativo: usuarioData.ativo !== undefined ? usuarioData.ativo : true,
                avatar_url: usuarioData.avatar_url
            }])
            .select('id, nome, email, role, ativo, avatar_url, created_at')
            .single();

        if (error) throw error;
        return data;
    }

    // Atualizar usuário
    static async update(id, usuarioData) {
        const updateData = {};

        if (usuarioData.nome !== undefined) updateData.nome = usuarioData.nome;
        if (usuarioData.email !== undefined) updateData.email = usuarioData.email;
        if (usuarioData.senha !== undefined) updateData.senha = usuarioData.senha;
        if (usuarioData.role !== undefined) updateData.role = usuarioData.role;
        if (usuarioData.ativo !== undefined) updateData.ativo = usuarioData.ativo;
        if (usuarioData.avatar_url !== undefined) updateData.avatar_url = usuarioData.avatar_url;

        const { data, error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id)
            .select('id, nome, email, role, ativo, avatar_url, created_at')
            .single();

        if (error) throw error;
        return data;
    }

    // Deletar usuário
    static async delete(id) {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}

module.exports = UsuarioSupabase;
