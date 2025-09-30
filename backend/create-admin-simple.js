// Criar admin usando cliente normal

const bcrypt = require('bcryptjs');

// Definir variáveis de ambiente
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';

const { supabase } = require('./config/supabase');

async function createAdmin() {
    try {
        console.log('🔐 Criando usuário admin (método simples)...');
        
        // Gerar hash da senha
        const senhaHash = await bcrypt.hash('admin123', 10);
        console.log('✅ Senha hasheada');
        
        // Dados do admin
        const adminData = {
            nome: 'Admin Site Ubatuba',
            email: 'admin@siteubatuba.com.br',
            senha: senhaHash,
            role: 'admin',
            ativo: true
        };
        
        console.log('📝 Tentando inserir admin...');
        
        // Tentar inserir via cliente normal
        const { data, error } = await supabase
            .from('usuarios')
            .insert([adminData])
            .select();
        
        if (error) {
            console.log('❌ Erro ao inserir:', error.message);
            
            // Se for problema de RLS, sugerir solução manual
            if (error.message.includes('row-level security')) {
                console.log('\n💡 SOLUÇÃO MANUAL:');
                console.log('1. Acesse: https://zrwxxnyygtesucsumzpg.supabase.co');
                console.log('2. Faça login no Supabase');
                console.log('3. Vá em: Table editor → usuarios');
                console.log('4. Clique em "Insert row"');
                console.log('5. Preencha os campos:');
                console.log('   nome: Admin Site Ubatuba');
                console.log('   email: admin@siteubatuba.com.br');
                console.log(`   senha: ${senhaHash}`);
                console.log('   role: admin');
                console.log('   ativo: true');
                console.log('6. Clique em "Save"');
                console.log('\n🧪 Depois teste o login novamente!');
            }
            
            return;
        }
        
        console.log('✅ Admin criado com sucesso!');
        console.log('📋 Dados:', data[0]);
        
        // Verificar se foi criado
        const { data: checkUser, error: checkError } = await supabase
            .from('usuarios')
            .select('id, nome, email, role, ativo')
            .eq('email', adminData.email)
            .single();
        
        if (checkError) {
            console.log('⚠️  Erro ao verificar usuário:', checkError.message);
        } else {
            console.log('\n╔══════════════════════════════════════════════╗');
            console.log('║            ✅ ADMIN CONFIGURADO!            ║');
            console.log('╚══════════════════════════════════════════════╝');
            console.log('\n🔐 Credenciais para login:');
            console.log('   Email: admin@siteubatuba.com.br');
            console.log('   Senha: admin123');
            console.log('\n🧪 AGORA TESTE O LOGIN NO SITE!');
        }
        
    } catch (error) {
        console.error('💥 Erro geral:', error.message);
    }
}

createAdmin();
