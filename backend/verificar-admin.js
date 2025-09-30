// Verificar se admin realmente existe no Supabase

// Definir variáveis de ambiente
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';

const { supabase } = require('./config/supabase');
const bcrypt = require('bcryptjs');

async function verificarAdmin() {
    try {
        console.log('🔍 Investigando usuários no Supabase...\n');
        
        // Tentar diferentes formas de buscar usuários
        
        console.log('1️⃣ Busca simples:');
        const { data: users1, error: error1 } = await supabase
            .from('usuarios')
            .select('*');
        
        if (error1) {
            console.log('❌ Erro:', error1.message);
        } else {
            console.log(`✅ Encontrados: ${users1?.length || 0} usuários`);
            if (users1?.length > 0) {
                users1.forEach(user => {
                    console.log(`   - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
                });
            }
        }
        
        console.log('\n2️⃣ Busca específica por email:');
        const { data: user2, error: error2 } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', 'admin@siteubatuba.com.br')
            .single();
        
        if (error2) {
            console.log('❌ Erro:', error2.message);
            if (error2.message.includes('No rows')) {
                console.log('   → Usuário com esse email NÃO existe!');
            }
        } else {
            console.log('✅ Usuário encontrado:');
            console.log('   Email:', user2.email);
            console.log('   Nome:', user2.nome);
            console.log('   Role:', user2.role);
            console.log('   Ativo:', user2.ativo);
            console.log('   Senha hash:', user2.senha?.substring(0, 20) + '...');
            
            // Testar se a senha bate
            const senhaCorreta = await bcrypt.compare('admin123', user2.senha);
            console.log('   Senha válida:', senhaCorreta ? '✅' : '❌');
        }
        
        console.log('\n3️⃣ Testando RLS (Row Level Security):');
        const { data: rls, error: rlsError } = await supabase
            .from('usuarios')
            .select('count');
        
        if (rlsError) {
            console.log('❌ RLS bloqueando:', rlsError.message);
        } else {
            console.log('✅ RLS permite acesso');
        }
        
        console.log('\n📊 DIAGNÓSTICO:');
        if (users1?.length === 0) {
            console.log('❌ PROBLEMA: Nenhum usuário encontrado na tabela');
            console.log('💡 POSSÍVEIS CAUSAS:');
            console.log('   1. Admin não foi criado corretamente no Supabase');
            console.log('   2. RLS está bloqueando a leitura');
            console.log('   3. Tabela está vazia ou não existe');
            console.log('\n🔧 SOLUÇÃO SUGERIDA:');
            console.log('   1. Verifique no dashboard do Supabase:');
            console.log('      https://zrwxxnyygtesucsumzpg.supabase.co');
            console.log('   2. Table editor → usuarios');
            console.log('   3. Confirme se existe um registro');
            console.log('   4. Se não existir, crie novamente');
        } else {
            console.log('✅ Usuários encontrados na tabela');
            if (user2) {
                console.log('✅ Admin específico encontrado');
                if (await bcrypt.compare('admin123', user2.senha)) {
                    console.log('✅ Senha está correta');
                    console.log('🔍 O problema pode ser no código de autenticação do backend');
                } else {
                    console.log('❌ Senha está incorreta no banco');
                    console.log('🔧 Precisa atualizar a senha no Supabase');
                }
            } else {
                console.log('❌ Admin com email específico NÃO encontrado');
                console.log('🔧 Precisa criar admin com o email correto');
            }
        }
        
    } catch (error) {
        console.error('💥 Erro geral:', error);
    }
}

verificarAdmin();
