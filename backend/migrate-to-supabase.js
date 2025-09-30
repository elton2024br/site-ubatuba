const fs = require('fs');
const path = require('path');
const { supabase } = require('./config/supabase');

async function migrate() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 MIGRAÇÃO DE DADOS: JSON → SUPABASE');
    console.log('='.repeat(60) + '\n');

    // Ler dados do JSON
    const dataPath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataPath)) {
        console.log('⚠️  Arquivo data.json não encontrado.');
        console.log('💡 Se você ainda não tem dados, pode pular esta etapa.\n');
        return;
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let stats = {
        usuarios: { success: 0, error: 0 },
        categorias: { success: 0, error: 0 },
        noticias: { success: 0, error: 0 },
        newsletter: { success: 0, error: 0 }
    };

    // Migrar Usuários
    console.log('👤 Migrando usuários...');
    for (const usuario of data.usuarios || []) {
        try {
            const { error } = await supabase.from('usuarios').insert({
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha, // Já está hasheada
                role: usuario.role || 'editor',
                ativo: usuario.ativo !== undefined ? usuario.ativo : true
            });
            
            if (error) throw error;
            console.log(`  ✅ ${usuario.email}`);
            stats.usuarios.success++;
        } catch (error) {
            console.log(`  ⚠️  ${usuario.email} - ${error.message}`);
            stats.usuarios.error++;
        }
    }

    // Migrar Categorias
    console.log('\n🏷️  Migrando categorias...');
    const categoriaMap = {}; // Mapear IDs antigos para novos
    
    for (const categoria of data.categorias || []) {
        try {
            const { data: newCategoria, error } = await supabase
                .from('categorias')
                .insert({
                    nome: categoria.nome,
                    cor: categoria.cor || '#0ea5e9',
                    descricao: categoria.descricao
                })
                .select()
                .single();
            
            if (error) throw error;
            
            categoriaMap[categoria.id] = newCategoria.id;
            console.log(`  ✅ ${categoria.nome} (ID: ${categoria.id} → ${newCategoria.id})`);
            stats.categorias.success++;
        } catch (error) {
            console.log(`  ⚠️  ${categoria.nome} - ${error.message}`);
            stats.categorias.error++;
        }
    }

    // Migrar Notícias
    console.log('\n📰 Migrando notícias...');
    for (const noticia of data.noticias || []) {
        try {
            const { error } = await supabase.from('noticias').insert({
                titulo: noticia.titulo,
                subtitulo: noticia.subtitulo,
                conteudo: noticia.conteudo,
                categoria_id: categoriaMap[noticia.categoria_id] || noticia.categoria_id,
                autor: noticia.autor,
                imagem_destaque: noticia.imagem_destaque,
                status: noticia.status || 'rascunho',
                destaque: noticia.destaque || false,
                views: noticia.views || 0,
                tempo_leitura: noticia.tempo_leitura || 5,
                data_publicacao: noticia.data_publicacao
            });
            
            if (error) throw error;
            console.log(`  ✅ ${noticia.titulo.substring(0, 50)}...`);
            stats.noticias.success++;
        } catch (error) {
            console.log(`  ⚠️  ${noticia.titulo.substring(0, 30)}... - ${error.message}`);
            stats.noticias.error++;
        }
    }

    // Migrar Newsletter
    console.log('\n📧 Migrando newsletter...');
    for (const inscrito of data.newsletter || []) {
        try {
            const { error } = await supabase.from('newsletter').insert({
                email: inscrito.email,
                confirmado: inscrito.confirmado || false
            });
            
            if (error) throw error;
            console.log(`  ✅ ${inscrito.email}`);
            stats.newsletter.success++;
        } catch (error) {
            console.log(`  ⚠️  ${inscrito.email} - ${error.message}`);
            stats.newsletter.error++;
        }
    }

    // Resumo
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(60));
    console.log(`👤 Usuários:    ${stats.usuarios.success} sucesso, ${stats.usuarios.error} erros`);
    console.log(`🏷️  Categorias: ${stats.categorias.success} sucesso, ${stats.categorias.error} erros`);
    console.log(`📰 Notícias:    ${stats.noticias.success} sucesso, ${stats.noticias.error} erros`);
    console.log(`📧 Newsletter:  ${stats.newsletter.success} sucesso, ${stats.newsletter.error} erros`);
    console.log('='.repeat(60));
    
    const totalSuccess = Object.values(stats).reduce((sum, s) => sum + s.success, 0);
    const totalError = Object.values(stats).reduce((sum, s) => sum + s.error, 0);
    
    console.log(`\n✅ Total de sucesso: ${totalSuccess}`);
    console.log(`⚠️  Total de erros:   ${totalError}`);
    
    if (totalError === 0) {
        console.log('\n🎉 Migração concluída com sucesso!');
    } else {
        console.log('\n⚠️  Migração concluída com alguns erros.');
        console.log('💡 Os erros geralmente são de dados duplicados, o que é normal.');
    }
    
    console.log('\n✨ Você pode agora:');
    console.log('  1. Verificar os dados no Supabase Table Editor');
    console.log('  2. Fazer backup do data.json');
    console.log('  3. Atualizar os controllers para usar Supabase');
    console.log('  4. Testar a aplicação\n');
}

migrate().catch(error => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
});
