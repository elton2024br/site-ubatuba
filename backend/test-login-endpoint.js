// Testar exatamente o que o endpoint de login faz

const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario-supabase');
const config = require('./config/config');

// Configurar variáveis de ambiente (caso não estejam definidas)
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';

async function testarLoginCompleto() {
    try {
        console.log('🧪 SIMULANDO ENDPOINT DE LOGIN\n');
        
        // Dados de entrada (como viria do frontend)
        const email = 'admin@siteubatuba.com.br';
        const senha = 'admin123';
        
        console.log('1️⃣ Dados de entrada:');
        console.log('   Email:', email);
        console.log('   Senha:', senha ? '***' : 'undefined');
        
        // Validação de entrada
        if (!email || !senha) {
            throw new Error('Email e senha são obrigatórios');
        }
        console.log('   ✅ Validação de entrada OK');
        
        // Buscar usuário
        console.log('\n2️⃣ Buscando usuário...');
        const user = await Usuario.findByEmail(email);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        console.log('   ✅ Usuário encontrado:', {
            id: user.id,
            nome: user.nome,
            email: user.email,
            ativo: user.ativo
        });
        
        // Verificar se ativo
        if (!user.ativo) {
            throw new Error('Usuário inativo');
        }
        console.log('   ✅ Usuário ativo');
        
        // Verificar senha
        console.log('\n3️⃣ Verificando senha...');
        console.log('   Senha hash no banco:', user.senha?.substring(0, 20) + '...');
        
        const isValidPassword = await Usuario.verifyPassword(senha, user.senha);
        
        if (!isValidPassword) {
            throw new Error('Senha inválida');
        }
        console.log('   ✅ Senha válida');
        
        // Gerar token JWT
        console.log('\n4️⃣ Gerando token JWT...');
        console.log('   JWT_SECRET:', config.JWT_SECRET ? config.JWT_SECRET.substring(0, 20) + '...' : 'UNDEFINED');
        console.log('   JWT_EXPIRE:', config.JWT_EXPIRE);
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRE }
        );
        
        console.log('   ✅ Token gerado:', token.substring(0, 30) + '...');
        
        // Resposta final
        const response = {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role
                }
            }
        };
        
        console.log('\n✅ LOGIN SIMULADO COM SUCESSO!');
        console.log('📦 Resposta:', {
            success: response.success,
            user: response.data.user,
            token: response.data.token.substring(0, 30) + '...'
        });
        
        return response;
        
    } catch (error) {
        console.error('\n💥 ERRO NO LOGIN SIMULADO:');
        console.error('   Mensagem:', error.message);
        console.error('   Stack:', error.stack);
        
        throw error;
    }
}

console.log('🔐 TESTANDO LÓGICA DO ENDPOINT DE LOGIN');
console.log('=' .repeat(50));

testarLoginCompleto()
    .then(result => {
        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('💡 Se este teste funciona mas o endpoint não,');
        console.log('   o problema pode estar em:');
        console.log('   1. Middleware de parsing do body');
        console.log('   2. Roteamento do Express');  
        console.log('   3. Variáveis de ambiente no servidor');
        console.log('   4. CORS ou headers');
    })
    .catch(error => {
        console.log('\n❌ TESTE FALHOU - MESMA CAUSA DO ERRO 500');
        console.log('💡 Problema identificado:', error.message);
    });
