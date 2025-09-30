# 🚀 Guia Rápido - Backend Ubatuba Reage

## ✅ Backend Implementado Com Sucesso!

O backend está 100% funcional com:
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ Banco de dados (JSON)
- ✅ Upload de imagens
- ✅ CRUD de notícias, categorias e newsletter
- ✅ Sistema de busca
- ✅ Analytics básico

## 📦 Como Usar

### 1. Certifique-se que está no diretório backend
```powershell
cd backend
```

### 2. As dependências já foram instaladas, mas se necessário:
```powershell
npm install
```

### 3. Popular banco de dados (já foi feito):
```powershell
npm run seed
```

### 4. Iniciar servidor:
```powershell
npm start
# OU para desenvolvimento com auto-reload:
npm run dev
```

O servidor estará em: **http://localhost:3000**

## 🧪 Testar a API

### Verificar se está funcionando:
```powershell
# PowerShell:
Invoke-WebRequest -Uri http://localhost:3000/api/health | Select-Object -Expand Content

# Ou abrir no navegador:
start http://localhost:3000/api/health
```

### Listar notícias:
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/noticias | Select-Object -Expand Content
```

### Fazer login (obter token):
```powershell
$body = @{
    email = "admin@ubatubareage.com.br"
    senha = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/auth/login -Method POST -Body $body -ContentType "application/json" | Select-Object -Expand Content
```

## 📝 Credenciais de Acesso

**Email:** admin@ubatubareage.com.br  
**Senha:** admin123

⚠️ **IMPORTANTE:** Altere estas credenciais em produção!

## 🔗 Endpoints Principais

### Públicos (sem autenticação):

- `GET /api/health` - Status da API
- `GET /api/noticias` - Listar notícias publicadas
- `GET /api/noticias/:slug` - Detalhes de uma notícia
- `GET /api/categorias` - Listar categorias
- `POST /api/newsletter/inscrever` - Inscrever na newsletter

**Exemplo de busca:**
```
GET /api/noticias?busca=praia&categoria=turismo&page=1&limit=10
```

### Protegidos (requerem autenticação):

**Headers necessários:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

- `POST /api/noticias/admin/criar` - Criar notícia
- `PUT /api/noticias/admin/atualizar/:id` - Editar notícia
- `DELETE /api/noticias/admin/deletar/:id` - Deletar notícia
- `POST /api/upload` - Upload de imagem

## 📂 Estrutura de Dados

### Criar Notícia (POST /api/noticias/admin/criar):
```json
{
  "titulo": "Título da Notícia",
  "subtitulo": "Subtítulo opcional",
  "conteudo": "<p>Conteúdo HTML</p>",
  "categoria_id": 1,
  "status": "publicado",
  "destaque": true,
  "tempo_leitura": 5
}
```

### Resposta de Sucesso:
```json
{
  "success": true,
  "message": "Notícia criada com sucesso",
  "data": {
    "id": 4,
    "titulo": "Título da Notícia",
    "slug": "titulo-da-noticia",
    ...
  }
}
```

## 🗂️ Banco de Dados

O banco de dados é um arquivo JSON (`data.json`) na raiz do backend.

**Estrutura:**
- `usuarios` - Administradores e editores
- `categorias` - Categorias de notícias
- `noticias` - Notícias do portal
- `newsletter` - Inscritos na newsletter
- `analytics` - Rastreamento de visualizações

Para resetar o banco:
```powershell
Remove-Item data.json
npm run seed
```

## 🔄 Migrar para SQLite Real (Futuro)

Para usar SQLite em vez de JSON:

1. Instale o sqlite3 (alternativa ao better-sqlite3):
```powershell
npm install sqlite3
```

2. Substitua os arquivos `-simple.js` pelos originais
3. Atualize os imports no código

## 🌐 Integrar com o Frontend

### Atualizar o frontend para usar a API:

No arquivo `js/main.js` do frontend, substitua as funções simuladas:

```javascript
// Busca REAL
async function performSearch(query) {
    try {
        const response = await fetch(`http://localhost:3000/api/noticias?busca=${query}`);
        const data = await response.json();
        
        if (data.success) {
            // Processar resultados
            showNotification(`${data.data.noticias.length} resultados encontrados`, 'success');
        }
    } catch (error) {
        showNotification('Erro ao buscar', 'error');
    }
}

// Newsletter REAL
async function subscribeToNewsletter(email) {
    if (!validateEmail(email)) {
        showNotification('Digite um e-mail válido', 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/newsletter/inscrever', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        showNotification(data.message, data.success ? 'success' : 'error');
    } catch (error) {
        showNotification('Erro ao inscrever', 'error');
    }
}
```

## 📊 Próximos Passos

1. ✅ Backend funcionando
2. ⏳ Criar painel administrativo (HTML/React)
3. ⏳ Integrar frontend com backend
4. ⏳ Sistema de envio de emails
5. ⏳ Deploy em servidor

## 🐛 Troubleshooting

### Porta 3000 já em uso:
```powershell
# Windows - matar processo na porta 3000:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro de permissão no uploads:
```powershell
# Criar pasta se não existir:
New-Item -ItemType Directory -Force -Path public\uploads
```

### Reinstalar dependências:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 📚 Documentação Completa

Consulte `backend/README.md` para documentação completa da API.

## 🎉 Está Tudo Pronto!

Seu backend está 100% funcional e pronto para uso! 

Para testar rapidamente, abra o navegador em:
- http://localhost:3000/api/health
- http://localhost:3000/api/noticias
- http://localhost:3000/api/categorias
