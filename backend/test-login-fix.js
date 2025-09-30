// Teste rápido das correções implementadas

// Configurar variáveis de ambiente
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';
process.env.JWT_SECRET = 'ubatuba_reage_2025_super_secret_key';

const Usuario = require('./models/Usuario-supabase');

async function testarCorrecoesLogin() {
    try {
        console.log('🧪 TESTANDO CORREÇÕES DO LOGIN\n');
        
        // Teste 1: Verificar se método verifyPassword existe
        console.log('1️⃣ Testando método verifyPassword...');
        if (typeof Usuario.verifyPassword === 'function') {
            console.log('   ✅ Método verifyPassword existe!');
            
            // Teste com senha conhecida
            const senhaPlain = 'admin123';
            const senhaHash = '$2a$10$Inq376YJd3BpmjzddL6pqOD6FL8OKkxSN0Tl8R9F0l9gX5vqgLE6O';
            
            const senhaValida = await Usuario.verifyPassword(senhaPlain, senhaHash);
            console.log('   📝 Teste de senha:', senhaValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
        } else {
            console.log('   ❌ Método verifyPassword não existe!');
        }
        
        // Teste 2: Verificar se método hashPassword existe  
        console.log('\n2️⃣ Testando método hashPassword...');
        if (typeof Usuario.hashPassword === 'function') {
            console.log('   ✅ Método hashPassword existe!');
            
            const novoHash = await Usuario.hashPassword('teste123');
            console.log('   📝 Hash gerado:', novoHash.substring(0, 20) + '...');
        } else {
            console.log('   ❌ Método hashPassword não existe!');
        }
        
        // Teste 3: Tentar buscar usuário (testar RLS)
        console.log('\n3️⃣ Testando busca de usuário...');
        try {
            const usuario = await Usuario.findByEmail('admin@siteubatuba.com.br');
            
            if (usuario) {
                console.log('   ✅ Usuário encontrado!');
                console.log('   📝 Dados:', {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                    ativo: usuario.ativo
                });
                
                // Teste 4: Verificar senha do usuário real
                console.log('\n4️⃣ Testando verificação de senha real...');
                const senhaRealValida = await Usuario.verifyPassword('admin123', usuario.senha);
                console.log('   📝 Senha admin123:', senhaRealValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
                
            } else {
                console.log('   ❌ Usuário não encontrado (RLS ainda bloqueando?)');
            }
        } catch (error) {
            console.log('   ❌ Erro ao buscar usuário:', error.message);
        }
        
        console.log('\n📊 DIAGNÓSTICO:');
        
        if (typeof Usuario.verifyPassword !== 'function') {
            console.log('❌ PROBLEMA: Método verifyPassword ainda não existe');
            console.log('💡 SOLUÇÃO: Reiniciar o backend para carregar as mudanças');
        } else {
            console.log('✅ Métodos de senha implementados corretamente');
        }
        
        console.log('\n🎯 PRÓXIMOS PASSOS:');
        console.log('1. Reinicie o backend: cd backend; npm start');
        console.log('2. Execute o SQL RLS no Supabase (se não fez)');
        console.log('3. Teste o login via interface web');
        console.log('4. Verifique os logs detalhados no terminal do backend');
        
    } catch (error) {
        console.error('💥 Erro no teste:', error);
    }
}

testarCorrecoesLogin();
