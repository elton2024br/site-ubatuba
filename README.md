# 🌊 Site Ubatuba

Portal de notícias local de Ubatuba/SP com sistema completo de gerenciamento de conteúdo (CMS).

![Status](https://img.shields.io/badge/status-production-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Sobre o Projeto

**Site Ubatuba** é um portal de notícias moderno e responsivo focado em cobrir eventos, política, cultura, turismo e meio ambiente da cidade de Ubatuba, litoral norte de São Paulo.

### ✨ Funcionalidades

#### Frontend Público
- 📰 Listagem de notícias por categoria
- 🔍 Sistema de busca em tempo real
- 📱 Design 100% responsivo (Mobile-First)
- ♿ Acessibilidade (WCAG 2.1 AA)
- 📊 Barra de progresso de leitura
- 🔗 Compartilhamento social
- 📧 Newsletter subscription
- ⚡ Performance otimizada (Lazy Loading)

#### Painel Administrativo
- 🔐 Autenticação JWT
- ✍️ CRUD completo de notícias
- 🏷️ Gerenciamento de categorias
- 📊 Dashboard com métricas
- 📧 Gestão de newsletter
- 🖼️ Upload de imagens
- 📝 Editor de conteúdo rico
- 👥 Gerenciamento de usuários

## 🚀 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS (via CDN)
- Font Awesome (ícones)
- Google Fonts (Inter)

### Backend
- Node.js + Express.js
- PostgreSQL (via Supabase)
- JWT Authentication
- Multer (upload de arquivos)
- bcryptjs (hash de senhas)

### Infraestrutura
- **Banco:** Supabase (PostgreSQL)
- **Deploy:** Vercel (Serverless)
- **Storage:** Supabase Storage
- **CI/CD:** GitHub Actions → Vercel

## 📦 Estrutura do Projeto

```
site-ubatuba/
├── backend/              # API Node.js + Express
│   ├── api/             # Serverless functions
│   ├── config/          # Configurações (DB, Supabase)
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Auth, upload, etc
│   ├── models/          # Models Supabase
│   ├── routes/          # Rotas da API
│   ├── public/uploads/  # Imagens (local dev)
│   └── server.js        # Entry point
├── admin/               # Painel administrativo
│   ├── js/             # Scripts do admin
│   ├── dashboard.html  # Dashboard
│   ├── noticias.html   # CRUD notícias
│   └── login.html      # Login admin
├── js/                  # Scripts do frontend
├── css/                 # Estilos customizados
├── index.html           # Home page
├── artigo.html          # Template de artigo
└── README.md
```

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 16+
- Conta no Supabase
- Conta na Vercel (para deploy)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/site-ubatuba.git
cd site-ubatuba
```

### 2. Configure o Backend
```bash
cd backend
npm install
```

### 3. Variáveis de Ambiente

Crie um arquivo `backend/.env`:

```env
# Supabase
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_publica
SUPABASE_SERVICE_KEY=sua_chave_servico

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRE=7d

# Admin
ADMIN_EMAIL=admin@siteubatuba.com.br
ADMIN_PASSWORD=admin123

# Server
PORT=3000
NODE_ENV=development
```

### 4. Configure o Banco de Dados

Execute o schema SQL no Supabase:

```bash
# No Supabase Dashboard → SQL Editor, execute:
backend/supabase/schema.sql
```

### 5. Popule o Banco com Dados Iniciais

```bash
cd backend
node seed-supabase.js
```

### 6. Rode o Servidor

```bash
npm start
# Servidor em: http://localhost:3000
```

### 7. Acesse o Frontend

Abra o arquivo `index.html` em um navegador ou use um servidor local:

```bash
# Opção 1: Live Server (VS Code Extension)
# Opção 2: Python
python -m http.server 8000

# Opção 3: Node.js
npx serve .
```

Acesse: `http://localhost:8000`

## 🔐 Credenciais Padrão

**Admin:**
- Email: `admin@siteubatuba.com.br`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## 🚀 Deploy

### Deploy Automático via GitHub + Vercel

1. **Faça push para o GitHub**
2. **Conecte o repositório à Vercel:**
   - Acesse: https://vercel.com/new
   - Importe seu repositório
   - Configure:
     - Root Directory: `backend`
     - Framework: Other
3. **Adicione as variáveis de ambiente** (Settings → Environment Variables)
4. **Deploy!**

A cada push para `main`, a Vercel fará redeploy automático.

### URLs de Produção

- **Backend API:** https://site-ubatuba-api.vercel.app
- **Frontend:** https://site-ubatuba.vercel.app

## 📚 Documentação da API

### Endpoints Públicos

```
GET  /api/health            - Health check
GET  /api/noticias          - Listar notícias
GET  /api/noticias/:id      - Notícia por ID
GET  /api/noticias/slug/:slug - Notícia por slug
GET  /api/categorias        - Listar categorias
POST /api/newsletter/inscrever - Inscrever newsletter
```

### Endpoints Admin (requerem JWT)

```
POST /api/auth/login        - Login
POST /api/noticias          - Criar notícia
PUT  /api/noticias/:id      - Atualizar notícia
DELETE /api/noticias/:id    - Deletar notícia
POST /api/upload            - Upload de imagem
```

### Exemplo de Uso

```javascript
// Login
const response = await fetch('https://site-ubatuba-api.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@siteubatuba.com.br',
    senha: 'admin123'
  })
});

const { token } = await response.json();

// Criar notícia
await fetch('https://site-ubatuba-api.vercel.app/api/noticias', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    titulo: 'Nova Notícia',
    conteudo: 'Conteúdo...',
    categoria_id: 1,
    status: 'publicado'
  })
});
```

## 🧪 Testes

```bash
# Testar conexão com Supabase
cd backend
node test-supabase.js

# Testar fluxo completo do admin
node test-admin-flow.js
```

## 📊 Performance

- ⚡ Lighthouse Score: 95+
- 🎨 First Contentful Paint: < 1.5s
- 📱 Mobile Friendly: 100%
- ♿ Accessibility: 100%

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

**Site Ubatuba Team**

## 📞 Contato

- Website: [siteubatuba.com.br](https://site-ubatuba.vercel.app)
- Email: contato@siteubatuba.com.br

---

**Desenvolvido com ❤️ para a comunidade de Ubatuba**