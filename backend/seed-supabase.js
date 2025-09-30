require('dotenv').config();
const { supabase } = require('./config/supabase');
const bcrypt = require('bcryptjs');
const config = require('./config/config');

async function seed() {
    console.log('🌱 Iniciando seed do banco Supabase...\n');

    try {
        // 1. Criar usuário admin
        console.log('👤 Criando usuário admin...');
        const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, 10);
        
        const { data: adminUser, error: userError } = await supabase
            .from('usuarios')
            .insert([
                {
                    nome: 'Admin Ubatuba Reage',
                    email: config.ADMIN_EMAIL,
                    senha: hashedPassword,
                    role: 'admin',
                    ativo: true
                }
            ])
            .select()
            .single();

        if (userError) {
            if (userError.message.includes('duplicate key')) {
                console.log('   ⚠️  Usuário admin já existe');
            } else {
                console.error('   ❌ Erro ao criar admin:', userError.message);
            }
        } else {
            console.log('   ✅ Admin criado:', adminUser.email);
        }

        // 2. Criar categorias (se não existirem)
        console.log('\n📁 Criando categorias...');
        const categorias = [
            { nome: 'Cidade', slug: 'cidade', cor: '#0ea5e9' },
            { nome: 'Turismo', slug: 'turismo', cor: '#f59e0b' },
            { nome: 'Meio Ambiente', slug: 'meio-ambiente', cor: '#10b981' },
            { nome: 'Cultura', slug: 'cultura', cor: '#a855f7' },
            { nome: 'Praias', slug: 'praias', cor: '#3b82f6' },
            { nome: 'Esportes', slug: 'esportes', cor: '#ef4444' }
        ];

        for (const cat of categorias) {
            const { error: catError } = await supabase
                .from('categorias')
                .insert([cat]);

            if (catError) {
                if (catError.message.includes('duplicate key')) {
                    console.log(`   ⚠️  Categoria '${cat.nome}' já existe`);
                } else {
                    console.error(`   ❌ Erro ao criar ${cat.nome}:`, catError.message);
                }
            } else {
                console.log(`   ✅ Categoria '${cat.nome}' criada`);
            }
        }

        // 3. Criar notícias de exemplo
        console.log('\n📰 Criando notícias de exemplo...');
        
        const { data: cidadeCategoria } = await supabase
            .from('categorias')
            .select('id')
            .eq('slug', 'cidade')
            .single();

        if (cidadeCategoria) {
            const noticias = [
                {
                    titulo: 'Obras de revitalização nas principais praias',
                    subtitulo: 'Prefeitura anuncia investimento de R$ 5 milhões em melhorias',
                    conteudo: 'A Prefeitura de Ubatuba anunciou hoje um grande plano de revitalização das principais praias da cidade...',
                    resumo: 'Investimento visa melhorar infraestrutura e acessibilidade',
                    categoria_id: cidadeCategoria.id,
                    autor: 'Admin Ubatuba Reage',
                    status: 'publicado',
                    destaque: true,
                    tempo_leitura: 5,
                    data_publicacao: new Date().toISOString()
                },
                {
                    titulo: 'Ubatuba bate recorde de visitantes',
                    subtitulo: 'Cidade recebe mais de 100 mil turistas no último fim de semana',
                    conteudo: 'A cidade de Ubatuba bateu um novo recorde de visitação neste último final de semana...',
                    resumo: 'Turismo aquecido movimenta economia local',
                    categoria_id: cidadeCategoria.id,
                    autor: 'Admin Ubatuba Reage',
                    status: 'publicado',
                    destaque: false,
                    tempo_leitura: 3,
                    data_publicacao: new Date().toISOString()
                }
            ];

            for (const noticia of noticias) {
                const { error: noticiaError } = await supabase
                    .from('noticias')
                    .insert([noticia]);

                if (noticiaError) {
                    console.error(`   ❌ Erro ao criar notícia:`, noticiaError.message);
                } else {
                    console.log(`   ✅ Notícia '${noticia.titulo}' criada`);
                }
            }
        }

        console.log('\n╔══════════════════════════════════════════════════════════════════╗');
        console.log('║                                                                  ║');
        console.log('║                 ✅ SEED CONCLUÍDO COM SUCESSO!                  ║');
        console.log('║                                                                  ║');
        console.log('╚══════════════════════════════════════════════════════════════════╝');
        console.log('\n📝 Credenciais de acesso:');
        console.log(`   Email: ${config.ADMIN_EMAIL}`);
        console.log(`   Senha: ${config.ADMIN_PASSWORD}\n`);

    } catch (error) {
        console.error('\n❌ Erro durante seed:', error.message);
        process.exit(1);
    }
}

seed();
