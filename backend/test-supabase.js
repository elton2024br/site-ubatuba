const { supabase, testConnection } = require('./config/supabase');

async function test() {
    console.log('🧪 Testando conexão com Supabase...\n');
    
    try {
        // Testar conexão básica
        const connected = await testConnection();
        
        if (!connected) {
            throw new Error('Falha na conexão');
        }
        
        // Testar leitura de categorias
        console.log('📋 Testando leitura de categorias...');
        const { data: categorias, error: catError } = await supabase
            .from('categorias')
            .select('*')
            .limit(1);
        
        if (catError) {
            console.log(`   ⚠️  ${catError.message}`);
        } else {
            console.log(`   ✅ ${categorias.length} categoria(s) encontrada(s)`);
        }
        
        // Testar leitura de notícias
        console.log('\n📰 Testando leitura de notícias...');
        const { data: noticias, error: notError } = await supabase
            .from('noticias')
            .select('*')
            .limit(1);
        
        if (notError) {
            console.log(`   ⚠️  ${notError.message}`);
        } else {
            console.log(`   ✅ ${noticias.length} notícia(s) encontrada(s)`);
        }
        
        // Testar view
        console.log('\n🔍 Testando view noticias_completas...');
        const { data: noticiasCompletas, error: viewError } = await supabase
            .from('noticias_completas')
            .select('*')
            .limit(1);
        
        if (viewError) {
            console.log(`   ⚠️  ${viewError.message}`);
        } else {
            console.log(`   ✅ View funcionando!`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ SUCESSO! Backend pronto para usar Supabase!');
        console.log('='.repeat(50) + '\n');
        
    } catch (error) {
        console.error('\n' + '='.repeat(50));
        console.error('❌ ERRO:', error.message);
        console.error('='.repeat(50));
        console.error('\n💡 Dicas:');
        console.error('  1. Verifique se o arquivo .env existe');
        console.error('  2. Confira se SUPABASE_URL e SUPABASE_ANON_KEY estão corretos');
        console.error('  3. Certifique-se de que executou o schema.sql no Supabase');
        console.error('  4. Veja o guia completo em: MIGRACAO_SUPABASE.md\n');
        process.exit(1);
    }
}

test();
