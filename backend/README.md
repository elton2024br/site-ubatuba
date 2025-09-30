# Backend - Ubatuba Reage

Backend completo em Node.js + Express + SQLite para o portal de notícias Ubatuba Reage.

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Inicializar banco e popular com dados
```bash
npm run seed
```

### 3. Iniciar servidor
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 📝 Credenciais Padrão

Após executar o seed:
- **Email:** admin@ubatubareage.com.br
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere estas credenciais em produção!

## 📚 Documentação da API

### Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ubatubareage.com.br",
  "senha": "admin123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome": "Administrador",
      "email": "admin@ubatubareage.com.br",
      "role": "admin"
    }
  }
}
```

### Notícias (Público)

#### Listar notícias
```http
GET /api/noticias?page=1&limit=10&categoria=turismo&busca=praia
```

#### Obter notícia por slug
```http
GET /api/noticias/obras-revitalizacao-praias-ubatuba
```

### Categorias (Público)

#### Listar categorias
```http
GET /api/categorias
```

### Newsletter (Público)

#### Inscrever
```http
POST /api/newsletter/inscrever
Content-Type: application/json

{
  "email": "usuario@example.com"
}
```

### Rotas Admin (Requerem Token)

Todas as rotas admin requerem header de autenticação:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

#### Criar notícia
```http
POST /api/noticias/admin/criar
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "titulo": "Título da notícia",
  "subtitulo": "Subtítulo",
  "conteudo": "<p>Conteúdo HTML</p>",
  "categoria_id": 1,
  "status": "publicado",
  "destaque": true
}
```

#### Upload de imagem
```http
POST /api/upload
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

imagem: [arquivo]
```

## 🗂️ Estrutura do Projeto

```
backend/
├── config/
│   ├── config.js           # Configurações gerais
│   ├── database.js         # Configuração do SQLite
│   └── seedData.js         # Dados iniciais
├── controllers/
│   ├── authController.js
│   ├── noticiasController.js
│   ├── categoriasController.js
│   └── newsletterController.js
├── middleware/
│   ├── auth.js             # Autenticação JWT
│   └── upload.js           # Upload de arquivos
├── models/
│   ├── Noticia.js
│   ├── Categoria.js
│   ├── Usuario.js
│   └── Newsletter.js
├── routes/
│   ├── auth.js
│   ├── noticias.js
│   ├── categorias.js
│   ├── newsletter.js
│   └── upload.js
├── public/uploads/         # Imagens enviadas
├── server.js               # Servidor principal
└── package.json
```

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação JWT
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting (pode ser adicionado)
- ✅ Validação de inputs

## 📊 Banco de Dados

O projeto usa SQLite (arquivo `ubatuba_reage.db`) com as seguintes tabelas:

- **usuarios** - Administradores e editores
- **categorias** - Categorias de notícias
- **noticias** - Notícias do portal
- **newsletter** - Inscritos na newsletter
- **comentarios** - Comentários (futuro)
- **analytics** - Rastreamento de visualizações

## 🛠️ Scripts Disponíveis

```bash
npm start         # Iniciar servidor em produção
npm run dev       # Iniciar com nodemon (dev)
npm run seed      # Popular banco com dados iniciais
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` (use `.env.example` como modelo):

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=seu_secret_aqui
ADMIN_EMAIL=admin@ubatubareage.com.br
ADMIN_PASSWORD=admin123
```

## 🚀 Deploy

### Opção 1: VPS (DigitalOcean, AWS, etc)

```bash
# Clonar repositório
git clone seu-repositorio

# Instalar dependências
cd backend && npm install --production

# Configurar .env
cp .env.example .env
nano .env

# Popular banco
npm run seed

# Iniciar com PM2
npm install -g pm2
pm2 start server.js --name ubatuba-api
pm2 startup
pm2 save
```

### Opção 2: Heroku

```bash
# Adicionar ao Heroku
heroku create ubatuba-reage-api

# Configurar variáveis
heroku config:set JWT_SECRET=seu_secret

# Deploy
git push heroku main
```

## 📈 Próximos Passos

- [ ] Sistema de comentários
- [ ] Envio de emails (newsletter, confirmação)
- [ ] Cache com Redis
- [ ] Paginação avançada
- [ ] Busca com Elasticsearch
- [ ] Painel admin web
- [ ] Notificações push
- [ ] API de estatísticas
- [ ] Backup automatizado

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "EACCES: permission denied"
```bash
sudo chmod -R 755 public/uploads
```

### Banco não inicializa
```bash
rm ubatuba_reage.db
npm run seed
```

## 📞 Suporte

Para issues e dúvidas, consulte a documentação ou abra uma issue no repositório.
