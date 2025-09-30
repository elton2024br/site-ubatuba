const { query, saveData } = require('./database-simple');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...\n');

        // 1. Criar usuário admin
        const adminEmail = 'admin@ubatubareage.com.br';
        const adminPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        const adminExists = query.get('usuarios', u => u.email === adminEmail);
        
        if (!adminExists) {
            query.insert('usuarios', {
                nome: 'Administrador',
                email: adminEmail,
                senha: hashedPassword,
                role: 'admin',
                ativo: true
            });
            console.log('✅ Usuário admin criado');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Senha: ${adminPassword}\n`);
        } else {
            console.log('⚠️  Usuário admin já existe\n');
        }

        // 2. Criar categorias
        const categorias = [
            { nome: 'Cidade', slug: 'cidade', cor: '#0ea5e9', descricao: 'Notícias sobre infraestrutura e serviços públicos' },
            { nome: 'Turismo', slug: 'turismo', cor: '#f59e0b', descricao: 'Informações sobre visitação e eventos turísticos' },
            { nome: 'Meio Ambiente', slug: 'meio-ambiente', cor: '#10b981', descricao: 'Preservação da Mata Atlântica e ecossistemas' },
            { nome: 'Cultura', slug: 'cultura', cor: '#8b5cf6', descricao: 'Eventos culturais e tradições caiçaras' },
            { nome: 'Praias', slug: 'praias', cor: '#06b6d4', descricao: 'Notícias sobre as praias de Ubatuba' },
            { nome: 'Esportes', slug: 'esportes', cor: '#ef4444', descricao: 'Esportes e competições locais' }
        ];

        for (const cat of categorias) {
            const exists = query.get('categorias', c => c.slug === cat.slug);
            if (!exists) {
                query.insert('categorias', cat);
                console.log(`✅ Categoria "${cat.nome}" criada`);
            }
        }
        console.log('');

        // 3. Criar notícias de exemplo
        const admin = query.get('usuarios', u => u.role === 'admin');
        const cidadeId = query.get('categorias', c => c.slug === 'cidade').id;
        const turismoId = query.get('categorias', c => c.slug === 'turismo').id;
        const meioAmbienteId = query.get('categorias', c => c.slug === 'meio-ambiente').id;

        const noticias = [
            {
                titulo: 'Prefeitura anuncia obras de revitalização nas principais praias de Ubatuba',
                slug: 'obras-revitalizacao-praias-ubatuba',
                subtitulo: 'Projeto inclui melhoria na infraestrutura de 12 praias, com investimento de R$ 8 milhões.',
                conteudo: '<p>A Prefeitura de Ubatuba anunciou nesta segunda-feira um ambicioso projeto de revitalização das principais praias da cidade, com investimento total de R$ 8 milhões. As obras devem começar em outubro e estar concluídas antes do início da alta temporada de verão.</p><h2>Principais melhorias</h2><ul><li>Reforma dos calçadões</li><li>Nova iluminação LED</li><li>Quiosques padronizados</li><li>Banheiros acessíveis</li></ul>',
                categoria_id: cidadeId,
                autor_id: admin.id,
                status: 'publicado',
                destaque: true,
                views: 0,
                tempo_leitura: 8,
                publicado_em: new Date().toISOString()
            },
            {
                titulo: 'Ubatuba bate recorde de visitantes no feriado prolongado',
                slug: 'ubatuba-recorde-visitantes-feriado',
                subtitulo: 'Cidade recebeu mais de 150 mil turistas no último fim de semana.',
                conteudo: '<p>A cidade de Ubatuba registrou o maior fluxo de turistas dos últimos cinco anos durante o feriado prolongado, com mais de 150 mil visitantes.</p>',
                categoria_id: turismoId,
                autor_id: admin.id,
                status: 'publicado',
                destaque: false,
                views: 0,
                tempo_leitura: 5,
                publicado_em: new Date().toISOString()
            },
            {
                titulo: 'Projeto de preservação da Mata Atlântica ganha apoio internacional',
                slug: 'projeto-preservacao-mata-atlantica',
                subtitulo: 'Iniciativa local recebe recursos de organização europeia.',
                conteudo: '<p>Um projeto de preservação da Mata Atlântica desenvolvido em Ubatuba conquistou apoio financeiro de uma organização ambiental europeia.</p>',
                categoria_id: meioAmbienteId,
                autor_id: admin.id,
                status: 'publicado',
                destaque: false,
                views: 0,
                tempo_leitura: 6,
                publicado_em: new Date().toISOString()
            }
        ];

        for (const noticia of noticias) {
            const exists = query.get('noticias', n => n.slug === noticia.slug);
            if (!exists) {
                query.insert('noticias', noticia);
                console.log(`✅ Notícia "${noticia.titulo.substring(0, 50)}..." criada`);
            }
        }

        saveData();

        console.log('\n🎉 Seed concluído com sucesso!\n');
        console.log('📝 Você pode fazer login com:');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Senha: ${adminPassword}\n`);

    } catch (error) {
        console.error('❌ Erro no seed:', error);
        throw error;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const { initDatabase } = require('./database-simple');
    initDatabase();
    seedDatabase()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { seedDatabase };
