const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Verificar variáveis de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ ERRO: Variáveis SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias!');
    console.error('📝 Crie um arquivo .env baseado em .env.example');
    process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: false
        }
    }
);

// Cliente com privilégios de service (para operações admin)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Testar conexão
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('categorias')
            .select('count');
        
        if (error) throw error;
        
        console.log('✅ Conexão com Supabase estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com Supabase:', error.message);
        return false;
    }
}

module.exports = {
    supabase,
    supabaseAdmin,
    testConnection
};
