// Testar RLS (Row Level Security) detalhadamente

// Configurar variáveis
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';

const { createClient } = require('@supabase/supabase-js');

// Cliente com anon key (usado no código)
const supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function testarRLS() {
    try {
        console.log('🔐 TESTE DETALHADO DE RLS\n');
        
        console.log('1️⃣ Testando com cliente ANON (usado no backend):');
        console.log('   Key usada:', process.env.SUPABASE_ANON_KEY.substring(0, 50) + '...');
        
        // Teste 1: Select simples
        const { data: users1, error: error1, count } = await supabaseAnon
            .from('usuarios')
            .select('*', { count: 'exact' });
        
        console.log('   Resultado:');
        console.log('   - Erro:', error1?.message || 'Nenhum');
        console.log('   - Count:', count);
        console.log('   - Registros:', users1?.length || 0);
        
        if (error1) {
            console.log('   - Código de erro:', error1.code);
            console.log('   - Detalhes:', error1.details);
        }
        
        // Teste 2: Select com filtro por email
        console.log('\n2️⃣ Testando busca específica por email:');
        const { data: user2, error: error2 } = await supabaseAnon
            .from('usuarios')
            .select('*')
            .eq('email', 'admin@siteubatuba.com.br');
        
        console.log('   Resultado:');
        console.log('   - Erro:', error2?.message || 'Nenhum');
        console.log('   - Registros encontrados:', user2?.length || 0);
        
        // Teste 3: Verificar políticas RLS
        console.log('\n3️⃣ Analisando possíveis problemas RLS:');
        
        if (error1?.message?.includes('permission denied') || 
            error1?.message?.includes('row-level security') ||
            error1?.message?.includes('policy')) {
            console.log('   ❌ RLS está BLOQUEANDO acesso!');
            console.log('   💡 Política de segurança impede leitura via API');
        } else if (users1?.length === 0 && count === 0) {
            console.log('   ⚠️  RLS permite acesso mas tabela aparenta estar vazia');
            console.log('   💡 Possível problema de sincronização ou cache');
        } else {
            console.log('   ✅ RLS parece estar funcionando');
        }
        
        // Teste 4: Tentar insert para testar políticas
        console.log('\n4️⃣ Testando políticas de escrita:');
        const testUser = {
            nome: 'Teste RLS',
            email: 'teste-rls@teste.com',
            senha: 'hashdummmy',
            role: 'user',
            ativo: true
        };
        
        const { error: insertError } = await supabaseAnon
            .from('usuarios')
            .insert([testUser]);
        
        if (insertError) {
            console.log('   ❌ Insert bloqueado:', insertError.message);
            if (insertError.message.includes('row-level security')) {
                console.log('   💡 Política RLS impede inserção via código');
            }
        } else {
            console.log('   ✅ Insert permitido');
            // Limpar o teste
            await supabaseAnon
                .from('usuarios')
                .delete()
                .eq('email', 'teste-rls@teste.com');
        }
        
        console.log('\n📊 DIAGNÓSTICO FINAL:');
        
        if (users1?.length === 0) {
            console.log('❌ PROBLEMA CONFIRMADO:');
            console.log('   • Dashboard mostra 1 usuário (acesso admin)');
            console.log('   • API mostra 0 usuários (acesso limitado)');
            console.log('   • RLS está bloqueando leitura via código');
            console.log('\n🔧 SOLUÇÕES POSSÍVEIS:');
            console.log('   1. Ajustar políticas RLS na tabela usuarios');
            console.log('   2. Usar service_role key (se disponível)');
            console.log('   3. Configurar política para permitir leitura pública');
            console.log('\n💡 PRÓXIMO PASSO:');
            console.log('   Vou tentar ajustar as políticas RLS via SQL...');
        } else {
            console.log('✅ Usuários encontrados via API!');
            console.log('   O problema deve estar em outro lugar...');
        }
        
    } catch (error) {
        console.error('💥 Erro geral:', error);
    }
}

testarRLS();
