// Testar criação de notícia

// Configurar variáveis de ambiente
process.env.SUPABASE_URL = 'https://zrwxxnyygtesucsumzpg.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ';

const Noticia = require('./models/Noticia-supabase');

async function testarCriacaoNoticia() {
    try {
        console.log('📰 TESTANDO CRIAÇÃO DE NOTÍCIA\n');
        
        // Dados de teste
        const noticiaTest = {
            titulo: 'Notícia de Teste',
            subtitulo: 'Teste de criação via código',
            conteudo: '<p>Conteúdo de teste</p>',
            categoria_id: 1,  // Ajustar conforme sua categoria
            autor_id: '46b3ef4e-bea2-4883-bfb0-4186f26d1616',  // ID do admin
            autor: 'Admin Site Ubatuba',
            imagem_destaque: '/uploads/test.jpg',
            status: 'rascunho',
            destaque: false,
            tempo_leitura: 3
        };
        
        console.log('📋 Dados da notícia:');
        console.log(JSON.stringify(noticiaTest, null, 2));
        
        console.log('\n📝 Tentando criar...');
        const noticia = await Noticia.create(noticiaTest);
        
        console.log('\n✅ NOTÍCIA CRIADA COM SUCESSO!');
        console.log('📦 Dados retornados:');
        console.log(JSON.stringify(noticia, null, 2));
        
    } catch (error) {
        console.error('\n❌ ERRO AO CRIAR NOTÍCIA:');
        console.error('   Mensagem:', error.message);
        console.error('   Código:', error.code);
        console.error('   Detalhes:', error.details);
        console.error('   Hint:', error.hint);
        
        if (error.message.includes('row-level security')) {
            console.log('\n💡 PROBLEMA: RLS está bloqueando inserção na tabela noticias');
            console.log('🔧 SOLUÇÃO: Executar SQL para ajustar políticas RLS');
        }
        
        if (error.message.includes('foreign key')) {
            console.log('\n💡 PROBLEMA: categoria_id ou autor_id inválido');
            console.log('🔧 SOLUÇÃO: Verificar IDs existentes');
        }
        
        if (error.message.includes('null value')) {
            console.log('\n💡 PROBLEMA: Campo obrigatório faltando');
            console.log('🔧 SOLUÇÃO: Verificar campos NOT NULL na tabela');
        }
    }
}

testarCriacaoNoticia();
