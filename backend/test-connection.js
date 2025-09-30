// Teste simples de conexão com Supabase

// Definir variáveis de ambiente
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';
process.env.SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE2NTA0MSwiZXhwIjoyMDc0NzQxMDQxfQ.pZKWJrKbJZu_VZo1lXy1CgoJvKvwEeB_2XZBJdpFXI8';

const { supabase, supabaseAdmin } = require('./config/supabase');

async function test() {
    try {
        console.log('🧪 Testando conexão normal...');
        
        // Teste com cliente normal
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .limit(1);
        
        if (error) {
            console.log('❌ Erro cliente normal:', error.message);
        } else {
            console.log('✅ Cliente normal funcionando!');
            console.log('   Dados:', data?.length, 'categorias');
        }
        
        console.log('\n🔑 Testando conexão admin...');
        
        // Teste com cliente admin
        const { data: adminData, error: adminError } = await supabaseAdmin
            .from('usuarios')
            .select('count');
        
        if (adminError) {
            console.log('❌ Erro cliente admin:', adminError.message);
        } else {
            console.log('✅ Cliente admin funcionando!');
        }
        
        // Verificar se existem usuários
        console.log('\n👤 Verificando usuários existentes...');
        const { data: users, error: usersError } = await supabase
            .from('usuarios')
            .select('id, nome, email, role');
        
        if (usersError) {
            console.log('❌ Erro ao buscar usuários:', usersError.message);
        } else {
            console.log(`✅ Encontrados ${users?.length || 0} usuários:`);
            users?.forEach(user => {
                console.log(`   - ${user.email} (${user.role})`);
            });
        }
        
    } catch (error) {
        console.error('💥 Erro geral:', error);
    }
}

test();
