const { supabase } = require('../config/supabase');

class NewsletterSupabase {
    // Listar todos os inscritos
    static async findAll() {
        const { data, error } = await supabase
            .from('newsletter')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Buscar por email
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('newsletter')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Buscar por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('newsletter')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Criar inscrição
    static async create(inscricaoData) {
        const { data, error } = await supabase
            .from('newsletter')
            .insert([{
                email: inscricaoData.email,
                confirmado: inscricaoData.confirmado || false,
                token_confirmacao: inscricaoData.token_confirmacao
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Confirmar inscrição
    static async confirmar(id) {
        const { data, error } = await supabase
            .from('newsletter')
            .update({ confirmado: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Deletar inscrição
    static async delete(id) {
        const { error } = await supabase
            .from('newsletter')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // Contar inscritos
    static async count(filters = {}) {
        let query = supabase
            .from('newsletter')
            .select('*', { count: 'exact', head: true });

        if (filters.confirmado !== undefined) {
            query = query.eq('confirmado', filters.confirmado);
        }

        const { count, error } = await query;

        if (error) throw error;
        return count || 0;
    }
}

module.exports = NewsletterSupabase;
