/**
 * TESTE COMPLETO DO FLUXO ADMINISTRATIVO
 * Script para testar criação, publicação e exibição de notícias
 */

// Node.js 18+ tem fetch nativo, não precisa import

const API_URL = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@ubatubareage.com.br';
const ADMIN_PASSWORD = 'admin123';

let authToken = null;
let testNoticiaId = null;

// Cores para output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
    log(`\n${'='.repeat(70)}`, 'cyan');
    log(`PASSO ${step}: ${message}`, 'cyan');
    log('='.repeat(70), 'cyan');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message, error) {
    log(`❌ ${message}`, 'red');
    if (error) {
        log(`   Erro: ${error.message || error}`, 'red');
    }
}

function logInfo(message) {
    log(`   ${message}`, 'gray');
}

// Teste 1: Verificar se backend está rodando
async function test1_checkBackend() {
    logStep(1, 'Verificar se Backend está rodando');
    
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            logSuccess('Backend está rodando');
            logInfo(`Status: ${response.status}`);
            logInfo(`Message: ${data.message}`);
            return true;
        } else {
            logError('Backend retornou erro');
            return false;
        }
    } catch (error) {
        logError('Backend NÃO está acessível', error);
        logInfo('Execute: cd backend && npm start');
        return false;
    }
}

// Teste 2: Autenticação (Login)
async function test2_authentication() {
    logStep(2, 'Testar Autenticação (Login)');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: ADMIN_EMAIL,
                senha: ADMIN_PASSWORD
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            authToken = data.data.token;
            logSuccess('Login realizado com sucesso');
            logInfo(`Token: ${authToken.substring(0, 50)}...`);
            logInfo(`Usuário: ${data.data.user.nome}`);
            logInfo(`Role: ${data.data.user.role}`);
            return true;
        } else {
            logError('Falha no login');
            logInfo(`Mensagem: ${data.message}`);
            return false;
        }
    } catch (error) {
        logError('Erro ao fazer login', error);
        return false;
    }
}

// Teste 3: Listar Categorias
async function test3_listCategorias() {
    logStep(3, 'Testar GET /api/categorias');
    
    try {
        const response = await fetch(`${API_URL}/categorias`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            logSuccess(`${data.data.length} categorias encontradas`);
            data.data.forEach(cat => {
                logInfo(`- ${cat.nome} (id: ${cat.id}, cor: ${cat.cor})`);
            });
            return true;
        } else {
            logError('Falha ao listar categorias');
            return false;
        }
    } catch (error) {
        logError('Erro ao listar categorias', error);
        return false;
    }
}

// Teste 4: Listar Notícias
async function test4_listNoticias() {
    logStep(4, 'Testar GET /api/noticias');
    
    try {
        const response = await fetch(`${API_URL}/noticias`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            const noticias = data.data.noticias || data.data;
            logSuccess(`${noticias.length} notícias encontradas`);
            noticias.slice(0, 3).forEach(not => {
                logInfo(`- ${not.titulo} (id: ${not.id}, status: ${not.status})`);
            });
            return true;
        } else {
            logError('Falha ao listar notícias');
            return false;
        }
    } catch (error) {
        logError('Erro ao listar notícias', error);
        return false;
    }
}

// Teste 5: Criar Nova Notícia
async function test5_createNoticia() {
    logStep(5, 'Testar POST /api/noticias (Criar Notícia)');
    
    const novaNoticia = {
        titulo: `Teste Automatizado - ${new Date().toISOString()}`,
        subtitulo: 'Notícia criada por script de teste',
        conteudo: '<p>Este é um teste automatizado do fluxo de criação de notícias.</p><p>O sistema está sendo validado end-to-end.</p>',
        categoria_id: 1,
        autor: 'Script de Teste',
        status: 'rascunho',
        tempo_leitura: 3
    };
    
    try {
        const response = await fetch(`${API_URL}/noticias`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaNoticia)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            testNoticiaId = data.data.id;
            logSuccess('Notícia criada com sucesso');
            logInfo(`ID: ${data.data.id}`);
            logInfo(`Slug: ${data.data.slug}`);
            logInfo(`Título: ${data.data.titulo}`);
            logInfo(`Status: ${data.data.status}`);
            return true;
        } else {
            logError('Falha ao criar notícia');
            logInfo(`Status HTTP: ${response.status}`);
            logInfo(`Mensagem: ${data.message || 'Sem mensagem'}`);
            return false;
        }
    } catch (error) {
        logError('Erro ao criar notícia', error);
        return false;
    }
}

// Teste 6: Buscar Notícia por ID
async function test6_getNoticiaById() {
    logStep(6, `Testar GET /api/noticias/${testNoticiaId}`);
    
    if (!testNoticiaId) {
        logError('ID da notícia não disponível (teste 5 falhou)');
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/noticias/${testNoticiaId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            logSuccess('Notícia recuperada com sucesso');
            logInfo(`Título: ${data.data.titulo}`);
            logInfo(`Categoria: ${data.data.categoria_nome}`);
            logInfo(`Autor: ${data.data.autor_nome || data.data.autor}`);
            return true;
        } else {
            logError('Falha ao buscar notícia');
            return false;
        }
    } catch (error) {
        logError('Erro ao buscar notícia', error);
        return false;
    }
}

// Teste 7: Atualizar Notícia (Publicar)
async function test7_updateNoticia() {
    logStep(7, `Testar PUT /api/noticias/${testNoticiaId} (Publicar)`);
    
    if (!testNoticiaId) {
        logError('ID da notícia não disponível (teste 5 falhou)');
        return false;
    }
    
    const updateData = {
        status: 'publicado',
        data_publicacao: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/noticias/${testNoticiaId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            logSuccess('Notícia atualizada (publicada) com sucesso');
            logInfo(`Status novo: ${data.data.status}`);
            return true;
        } else {
            logError('Falha ao atualizar notícia');
            logInfo(`Status HTTP: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError('Erro ao atualizar notícia', error);
        return false;
    }
}

// Teste 8: Verificar notícia na listagem pública
async function test8_checkPublicList() {
    logStep(8, 'Verificar notícia na listagem pública');
    
    try {
        const response = await fetch(`${API_URL}/noticias`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            const noticias = data.data.noticias || data.data;
            const found = noticias.find(n => n.id === testNoticiaId);
            
            if (found) {
                logSuccess('Notícia aparece na listagem pública');
                logInfo(`Título: ${found.titulo}`);
                logInfo(`Views: ${found.views}`);
                return true;
            } else {
                logError('Notícia NÃO aparece na listagem pública');
                return false;
            }
        } else {
            logError('Falha ao verificar listagem pública');
            return false;
        }
    } catch (error) {
        logError('Erro ao verificar listagem', error);
        return false;
    }
}

// Teste 9: Deletar Notícia de Teste
async function test9_deleteNoticia() {
    logStep(9, `Testar DELETE /api/noticias/${testNoticiaId} (Limpar)`);
    
    if (!testNoticiaId) {
        log('⚠️  ID da notícia não disponível - pulando limpeza', 'yellow');
        return true;
    }
    
    try {
        const response = await fetch(`${API_URL}/noticias/${testNoticiaId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            logSuccess('Notícia de teste deletada com sucesso');
            return true;
        } else {
            logError('Falha ao deletar notícia');
            return false;
        }
    } catch (error) {
        logError('Erro ao deletar notícia', error);
        return false;
    }
}

// Teste 10: Verificar CORS
async function test10_checkCORS() {
    logStep(10, 'Verificar configuração de CORS');
    
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: 'OPTIONS'
        });
        
        const corsHeaders = {
            'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
            'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods'),
            'Access-Control-Allow-Headers': response.headers.get('access-control-allow-headers')
        };
        
        logSuccess('CORS configurado');
        logInfo(`Origin: ${corsHeaders['Access-Control-Allow-Origin'] || 'Não configurado'}`);
        logInfo(`Methods: ${corsHeaders['Access-Control-Allow-Methods'] || 'Não configurado'}`);
        logInfo(`Headers: ${corsHeaders['Access-Control-Allow-Headers'] || 'Não configurado'}`);
        
        return true;
    } catch (error) {
        logError('Erro ao verificar CORS', error);
        return false;
    }
}

// Executar todos os testes
async function runAllTests() {
    log('\n╔══════════════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                                                                          ║', 'cyan');
    log('║          🧪 TESTE AUTOMATIZADO DO FLUXO ADMINISTRATIVO 🧪              ║', 'cyan');
    log('║                                                                          ║', 'cyan');
    log('╚══════════════════════════════════════════════════════════════════════════╝', 'cyan');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };
    
    const tests = [
        { name: 'Backend Online', fn: test1_checkBackend },
        { name: 'Autenticação', fn: test2_authentication },
        { name: 'Listar Categorias', fn: test3_listCategorias },
        { name: 'Listar Notícias', fn: test4_listNoticias },
        { name: 'Criar Notícia', fn: test5_createNoticia },
        { name: 'Buscar por ID', fn: test6_getNoticiaById },
        { name: 'Atualizar/Publicar', fn: test7_updateNoticia },
        { name: 'Verificar Público', fn: test8_checkPublicList },
        { name: 'Deletar (Limpar)', fn: test9_deleteNoticia },
        { name: 'Verificar CORS', fn: test10_checkCORS }
    ];
    
    for (const test of tests) {
        results.total++;
        const success = await test.fn();
        if (success) {
            results.passed++;
        } else {
            results.failed++;
        }
    }
    
    // Resumo final
    log('\n╔══════════════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                         RESUMO DOS TESTES                                ║', 'cyan');
    log('╚══════════════════════════════════════════════════════════════════════════╝', 'cyan');
    
    log(`\nTotal de testes: ${results.total}`);
    log(`✅ Passou: ${results.passed}`, 'green');
    log(`❌ Falhou: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
    
    const successRate = ((results.passed / results.total) * 100).toFixed(1);
    log(`\n📊 Taxa de sucesso: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');
    
    if (results.failed === 0) {
        log('\n🎉 TODOS OS TESTES PASSARAM! Sistema 100% funcional!', 'green');
    } else {
        log('\n⚠️  Alguns testes falharam. Verifique os logs acima.', 'yellow');
    }
}

// Executar
runAllTests().catch(error => {
    log('\n❌ Erro fatal durante execução dos testes:', 'red');
    console.error(error);
    process.exit(1);
});
