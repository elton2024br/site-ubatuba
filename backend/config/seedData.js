const { db } = require('./database');
const bcrypt = require('bcryptjs');
const config = require('./config');

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...\n');

        // 1. Criar usuário admin
        const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, 10);
        
        const adminExists = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(config.ADMIN_EMAIL);
        
        if (!adminExists) {
            db.prepare(`
                INSERT INTO usuarios (nome, email, senha, role) 
                VALUES (?, ?, ?, ?)
            `).run('Administrador', config.ADMIN_EMAIL, hashedPassword, 'admin');
            console.log('✅ Usuário admin criado');
            console.log(`   Email: ${config.ADMIN_EMAIL}`);
            console.log(`   Senha: ${config.ADMIN_PASSWORD}\n`);
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
            const exists = db.prepare('SELECT id FROM categorias WHERE slug = ?').get(cat.slug);
            if (!exists) {
                db.prepare(`
                    INSERT INTO categorias (nome, slug, cor, descricao) 
                    VALUES (?, ?, ?, ?)
                `).run(cat.nome, cat.slug, cat.cor, cat.descricao);
                console.log(`✅ Categoria "${cat.nome}" criada`);
            }
        }
        console.log('');

        // 3. Criar notícias de exemplo
        const admin = db.prepare('SELECT id FROM usuarios WHERE role = ?').get('admin');
        const cidadeId = db.prepare('SELECT id FROM categorias WHERE slug = ?').get('cidade').id;
        const turismoId = db.prepare('SELECT id FROM categorias WHERE slug = ?').get('turismo').id;
        const meioAmbienteId = db.prepare('SELECT id FROM categorias WHERE slug = ?').get('meio-ambiente').id;

        const noticias = [
            {
                titulo: 'Prefeitura anuncia obras de revitalização nas principais praias de Ubatuba',
                slug: 'obras-revitalizacao-praias-ubatuba',
                subtitulo: 'Projeto inclui melhoria na infraestrutura de 12 praias, com investimento de R$ 8 milhões.',
                conteudo: `<p>A Prefeitura de Ubatuba anunciou nesta segunda-feira um ambicioso projeto de revitalização das principais praias da cidade, com investimento total de R$ 8 milhões. As obras devem começar em outubro e estar concluídas antes do início da alta temporada de verão, beneficiando tanto turistas quanto moradores.</p>

<h2>O que será feito</h2>
<p>O projeto contempla melhorias em 12 praias do município, incluindo Enseada, Grande, Vermelha do Norte, Toninhas, Perequê-Açu, Flamengo, Saco da Ribeira, Lázaro, Domingas Dias, Maranduba, Itamambuca e Félix.</p>

<ul>
<li>Reforma e ampliação de calçadões com piso antiderrapante</li>
<li>Instalação de novos quiosques padronizados</li>
<li>Modernização do sistema de iluminação LED</li>
<li>Criação de áreas de estacionamento público</li>
<li>Instalação de banheiros públicos acessíveis</li>
</ul>

<p>As intervenções incluem reformas em calçadões, instalação de novos quiosques, melhoria na iluminação e ampliação de áreas de estacionamento.</p>`,
                categoria_id: cidadeId,
                autor_id: admin.id,
                status: 'publicado',
                destaque: 1,
                tempo_leitura: 8,
                publicado_em: new Date().toISOString()
            },
            {
                titulo: 'Ubatuba bate recorde de visitantes no feriado prolongado',
                slug: 'ubatuba-recorde-visitantes-feriado',
                subtitulo: 'Cidade recebeu mais de 150 mil turistas no último fim de semana, aquecendo economia local.',
                conteudo: `<p>A cidade de Ubatuba registrou o maior fluxo de turistas dos últimos cinco anos durante o feriado prolongado, com mais de 150 mil visitantes. O movimento positivo aqueceu a economia local e demonstrou a força do destino turístico.</p>

<h2>Impacto econômico</h2>
<p>Segundo a Secretaria de Turismo, o setor hoteleiro atingiu 95% de ocupação, e restaurantes e comércios locais reportaram aumento de até 40% no faturamento comparado ao mesmo período do ano anterior.</p>`,
                categoria_id: turismoId,
                autor_id: admin.id,
                status: 'publicado',
                destaque: 0,
                tempo_leitura: 5,
                publicado_em: new Date().toISOString()
            },
            {
                titulo: 'Projeto de preservação da Mata Atlântica ganha apoio internacional',
                slug: 'projeto-preservacao-mata-atlantica',
                subtitulo: 'Iniciativa local recebe recursos de organização europeia para ampliar área de proteção ambiental.',
                conteudo: `<p>Um projeto de preservação da Mata Atlântica desenvolvido em Ubatuba conquistou apoio financeiro de uma organização ambiental europeia. A iniciativa visa ampliar a área de proteção e desenvolver programas de educação ambiental.</p>

<h2>Sobre o projeto</h2>
<p>O projeto focará na recuperação de áreas degradadas e na criação de corredores ecológicos que conectem diferentes fragmentos de floresta na região.</p>`,
                categoria_id: meioAmbienteId,
                autor_id: admin.id,
                status: 'publicado',
                destaque: 0,
                tempo_leitura: 6,
                publicado_em: new Date().toISOString()
            }
        ];

        for (const noticia of noticias) {
            const exists = db.prepare('SELECT id FROM noticias WHERE slug = ?').get(noticia.slug);
            if (!exists) {
                db.prepare(`
                    INSERT INTO noticias (titulo, slug, subtitulo, conteudo, categoria_id, autor_id, status, destaque, tempo_leitura, publicado_em) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    noticia.titulo,
                    noticia.slug,
                    noticia.subtitulo,
                    noticia.conteudo,
                    noticia.categoria_id,
                    noticia.autor_id,
                    noticia.status,
                    noticia.destaque,
                    noticia.tempo_leitura,
                    noticia.publicado_em
                );
                console.log(`✅ Notícia "${noticia.titulo.substring(0, 50)}..." criada`);
            }
        }

        console.log('\n🎉 Seed concluído com sucesso!\n');
        console.log('📝 Você pode fazer login com:');
        console.log(`   Email: ${config.ADMIN_EMAIL}`);
        console.log(`   Senha: ${config.ADMIN_PASSWORD}\n`);

    } catch (error) {
        console.error('❌ Erro no seed:', error);
        throw error;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const { initDatabase } = require('./database');
    initDatabase();
    seedDatabase()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { seedDatabase };
