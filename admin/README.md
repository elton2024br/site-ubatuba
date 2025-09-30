# 🎨 Painel Administrativo - Ubatuba Reage

Painel administrativo completo para gerenciar o site de notícias Ubatuba Reage.

## 📋 Funcionalidades

### ✅ Autenticação
- Login seguro com JWT
- Proteção de rotas
- Logout

### 📰 Gerenciamento de Notícias
- ✅ Listar todas as notícias
- ✅ Criar nova notícia
- ✅ Editar notícia existente
- ✅ Excluir notícia
- ✅ Upload de imagem de destaque
- ✅ Filtros por categoria e status
- ✅ Busca por título
- ✅ Editor HTML

### 🏷️ Gerenciamento de Categorias
- ✅ Listar categorias
- ✅ Criar nova categoria
- ✅ Editar categoria
- ✅ Excluir categoria
- ✅ Escolher cor personalizada

### 📧 Gerenciamento de Newsletter
- ✅ Listar inscritos
- ✅ Confirmar inscrição
- ✅ Excluir inscrito
- ✅ Exportar para CSV
- ✅ Filtros e busca
- ✅ Estatísticas

### 📊 Dashboard
- ✅ Estatísticas gerais
- ✅ Visualizações totais
- ✅ Total de notícias
- ✅ Inscritos na newsletter
- ✅ Notícias recentes
- ✅ Status do sistema

## 🚀 Como Usar

### 1. Iniciar o Backend

```bash
cd backend
npm start
```

O backend deve estar rodando em `http://localhost:3000`

### 2. Acessar o Painel

Abra o arquivo `admin/login.html` no navegador ou configure um servidor local.

### 3. Fazer Login

**Credenciais padrão:**
- **Email:** admin@ubatubareage.com.br
- **Senha:** admin123

> ⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## 📁 Estrutura de Arquivos

```
admin/
├── login.html          # Página de login
├── dashboard.html      # Dashboard principal
├── noticias.html       # Gerenciamento de notícias
├── categorias.html     # Gerenciamento de categorias
├── newsletter.html     # Gerenciamento de newsletter
├── js/
│   ├── login.js        # Lógica de autenticação
│   ├── dashboard.js    # Lógica do dashboard
│   ├── noticias.js     # CRUD de notícias
│   ├── categorias.js   # CRUD de categorias
│   └── newsletter.js   # Gerenciamento de inscritos
└── README.md          # Este arquivo
```

## 🎯 Principais Recursos

### Autenticação JWT
- Token armazenado no localStorage
- Verificação automática em todas as páginas
- Redirecionamento para login se não autenticado

### Interface Moderna
- Design responsivo (mobile-first)
- Tailwind CSS
- Font Awesome icons
- Animações suaves
- Feedback visual

### Operações CRUD
- Create (Criar)
- Read (Ler)
- Update (Atualizar)
- Delete (Excluir)

### Upload de Imagens
- Suporte para JPEG, PNG, GIF, WebP
- Preview antes do upload
- Limite de 5MB por imagem

## 🔐 Segurança

- ✅ Autenticação via JWT
- ✅ Rotas protegidas
- ✅ Validação de formulários
- ✅ Headers de segurança (Helmet no backend)
- ✅ Rate limiting no backend
- ⚠️ **Atenção:** Em produção, use HTTPS e altere as credenciais padrão

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura
- **Tailwind CSS** - Estilização
- **JavaScript Vanilla** - Lógica
- **Font Awesome** - Ícones
- **Fetch API** - Requisições HTTP

## 📝 Fluxo de Uso

1. **Login** → Autenticação com email e senha
2. **Dashboard** → Visualização de estatísticas gerais
3. **Notícias** → Criar/editar notícias com upload de imagem
4. **Categorias** → Gerenciar categorias de notícias
5. **Newsletter** → Ver inscritos e exportar lista

## 🐛 Troubleshooting

### Backend não está respondendo
- Verifique se o servidor está rodando em `http://localhost:3000`
- Execute `cd backend && npm start`

### Erro de CORS
- O backend já está configurado com CORS habilitado
- Verifique se está acessando de `localhost` ou `127.0.0.1`

### Token inválido
- Faça logout e login novamente
- O token JWT expira após 7 dias

### Upload de imagem falha
- Verifique se o diretório `backend/public/uploads` existe
- Limite máximo: 5MB por imagem
- Formatos aceitos: JPEG, PNG, GIF, WebP

## 📈 Próximos Passos

- [ ] Implementar envio real de emails para newsletter
- [ ] Adicionar sistema de comentários
- [ ] Implementar análise de métricas avançadas
- [ ] Criar editor de texto rico (WYSIWYG)
- [ ] Adicionar sistema de usuários múltiplos
- [ ] Implementar logs de auditoria

## 🎉 Pronto para Usar!

O painel está 100% funcional e conectado ao backend. Basta fazer login e começar a gerenciar seu site de notícias!

---

**Desenvolvido para Ubatuba Reage** | 2024
