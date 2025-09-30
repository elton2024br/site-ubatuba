// ===== CRIAÇÃO EMERGENCIAL DO ADMIN =====
// Este script cria o usuário admin diretamente no Supabase

const bcrypt = require('bcryptjs');

// Usar configuração existente do backend
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';
process.env.SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE2NTA0MSwiZXhwIjoyMDc0NzQxMDQxfQ.pZKWJrKbJZu_VZo1lXy1CgoJvKvwEeB_2XZBJdpFXI8';

const { supabaseAdmin } = require('./config/supabase');
const supabase = supabaseAdmin;

async function createAdmin() {
    try {
        console.log('🔐 Criando usuário admin...');
        
        // Gerar hash da senha
        const senhaHash = await bcrypt.hash('admin123', 10);
        console.log('✅ Senha hasheada');
        
        // Dados do admin
        const adminData = {
            nome: 'Admin Ubatuba Reage',
            email: 'admin@siteubatuba.com.br',
            senha: senhaHash,
            role: 'admin',
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Verificar se admin já existe
        const { data: existingAdmin } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('email', adminData.email)
            .single();
        
        if (existingAdmin) {
            console.log('⚠️  Admin já existe, atualizando...');
            
            const { error: updateError } = await supabase
                .from('usuarios')
                .update({
                    nome: adminData.nome,
                    senha: adminData.senha,
                    role: adminData.role,
                    ativo: adminData.ativo,
                    updated_at: adminData.updated_at
                })
                .eq('email', adminData.email);
            
            if (updateError) {
                throw updateError;
            }
            
            console.log('✅ Admin atualizado com sucesso!');
        } else {
            console.log('➕ Criando novo admin...');
            
            const { error: insertError } = await supabase
                .from('usuarios')
                .insert([adminData]);
            
            if (insertError) {
                throw insertError;
            }
            
            console.log('✅ Admin criado com sucesso!');
        }
        
        // Verificar se admin foi criado/atualizado
        const { data: adminVerify, error: verifyError } = await supabase
            .from('usuarios')
            .select('id, nome, email, role, ativo')
            .eq('email', adminData.email)
            .single();
        
        if (verifyError) {
            throw verifyError;
        }
        
        console.log('\n╔══════════════════════════════════════════════╗');
        console.log('║            ✅ ADMIN CONFIGURADO!            ║');
        console.log('╚══════════════════════════════════════════════╝');
        console.log('\n📋 Dados do admin:');
        console.log(`   ID: ${adminVerify.id}`);
        console.log(`   Nome: ${adminVerify.nome}`);
        console.log(`   Email: ${adminVerify.email}`);
        console.log(`   Role: ${adminVerify.role}`);
        console.log(`   Ativo: ${adminVerify.ativo ? '✅' : '❌'}`);
        
        console.log('\n🔐 Credenciais para login:');
        console.log('   Email: admin@siteubatuba.com.br');
        console.log('   Senha: admin123');
        
        console.log('\n🧪 AGORA TESTE O LOGIN!');
        
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error.message);
        console.error('Detalhes:', error);
        
        if (error.message.includes('violates row-level security')) {
            console.log('\n💡 Solução alternativa:');
            console.log('1. Acesse: https://zrwxxnyygtesucsumzpg.supabase.co');
            console.log('2. Vá em: Table editor → usuarios');
            console.log('3. Clique em "Insert row"');
            console.log('4. Preencha:');
            console.log('   nome: Admin Ubatuba Reage');
            console.log('   email: admin@siteubatuba.com.br');
            console.log('   senha: $2a$10$' + await bcrypt.hash('admin123', 10).then(h => h.substring(7)));
            console.log('   role: admin');
            console.log('   ativo: true');
        }
    }
}

// Executar
createAdmin().then(() => {
    console.log('\n🎯 Script finalizado!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
});
