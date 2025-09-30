# 🚀 GUIA DE DEPLOY NA VERCEL - UBATUBA REAGE

**Data:** 30/09/2025  
**Versão:** 1.0  
**Status:** Pronto para Deploy

---

## 📋 PRÉ-REQUISITOS

1. ✅ Conta na Vercel (https://vercel.com)
2. ✅ Conta no Supabase (já configurada)
3. ✅ Git instalado
4. ✅ Projeto funcionando localmente

---

## 🎯 OPÇÕES DE DEPLOY

### Opção 1: Deploy via Vercel CLI (Recomendado)
### Opção 2: Deploy via GitHub
### Opção 3: Deploy via Vercel Dashboard (Drag & Drop)

---

## 🚀 OPÇÃO 1: DEPLOY VIA VERCEL CLI

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer Login

```bash
vercel login
```

### Passo 3: Preparar Backend

```bash
cd backend
```

### Passo 4: Configurar Variáveis de Ambiente na Vercel

Você precisará adicionar as seguintes variáveis de ambiente:

```bash
vercel env add SUPABASE_URL production
# Cole: https://zrwxxnyygtesucsumzpg.supabase.co

vercel env add SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add SUPABASE_SERVICE_KEY production
# Cole a mesma key acima

vercel env add JWT_SECRET production
# Cole: ubatuba_reage_2025_super_secret_key

vercel env add ADMIN_EMAIL production
# Cole: admin@ubatubareage.com.br

vercel env add ADMIN_PASSWORD production
# Cole: admin123

vercel env add NODE_ENV production
# Cole: production
```

### Passo 5: Deploy do Backend

```bash
# Deploy de teste
vercel

# Deploy para produção
vercel --prod
```

A Vercel retornará uma URL, por exemplo:
```
https://ubatuba-reage-backend.vercel.app
```

### Passo 6: Atualizar Frontend

Abra os arquivos do admin e atualize a URL da API:

**admin/js/login.js:**
```javascript
// Trocar de:
const API_URL = 'http://localhost:3000/api';

// Para:
const API_URL = 'https://ubatuba-reage-backend.vercel.app/api';
```

**admin/js/noticias.js:**
```javascript
// Trocar de:
const API_URL = 'http://localhost:3000/api';

// Para:
const API_URL = 'https://ubatuba-reage-backend.vercel.app/api';
```

**admin/js/dashboard.js:**
```javascript
// Trocar de:
const API_URL = 'http://localhost:3000/api';

// Para:
const API_URL = 'https://ubatuba-reage-backend.vercel.app/api';
```

**admin/js/categorias.js:**
```javascript
// Trocar de:
const API_URL = 'http://localhost:3000/api';

// Para:
const API_URL = 'https://ubatuba-reage-backend.vercel.app/api';
```

**admin/js/newsletter.js:**
```javascript
// Trocar de:
const API_URL = 'http://localhost:3000/api';

// Para:
const API_URL = 'https://ubatuba-reage-backend.vercel.app/api';
```

**js/main.js:**
```javascript
// Adicionar no início:
const API_URL = 'https://ubatuba-reage-backend.vercel.app';

// Atualizar as chamadas:
fetch(`${API_URL}/api/noticias?busca=...`)
fetch(`${API_URL}/api/newsletter/inscrever`, ...)
```

### Passo 7: Deploy do Frontend

```bash
cd ..  # Voltar para raiz do projeto
vercel --prod
```

---

## 🚀 OPÇÃO 2: DEPLOY VIA GITHUB

### Passo 1: Criar Repositório no GitHub

```bash
# Inicializar Git (se ainda não estiver)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Deploy: Ubatuba Reage"

# Adicionar remote
git remote add origin https://github.com/seu-usuario/ubatuba-reage.git

# Push
git push -u origin main
```

### Passo 2: Conectar com Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New Project"
3. Selecione "Import Git Repository"
4. Escolha seu repositório GitHub
5. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** (deixe vazio)
   - **Output Directory:** (deixe vazio)

### Passo 3: Adicionar Variáveis de Ambiente

No dashboard da Vercel:
1. Settings → Environment Variables
2. Adicione todas as variáveis:

```
SUPABASE_URL = https://zrwxxnyygtesucsumzpg.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET = ubatuba_reage_2025_super_secret_key
ADMIN_EMAIL = admin@ubatubareage.com.br
ADMIN_PASSWORD = admin123
NODE_ENV = production
```

### Passo 4: Deploy

Clique em "Deploy" e aguarde.

---

## 🚀 OPÇÃO 3: DEPLOY VIA DASHBOARD (Drag & Drop)

### Passo 1: Preparar Projeto

Crie um arquivo `.vercelignore` na pasta `backend`:

```
node_modules
.env
data.json
public/uploads/*
```

### Passo 2: Upload

1. Acesse https://vercel.com/new
2. Arraste a pasta `backend` para a área de upload
3. Configure as variáveis de ambiente (como na Opção 2)
4. Clique em "Deploy"

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### 1. CORS em Produção

Edite `backend/server.js`:

```javascript
// Atualizar CORS para produção
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://seu-dominio-frontend.vercel.app', 'https://ubatuba-reage.vercel.app']
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Upload de Imagens

⚠️ **IMPORTANTE:** A Vercel tem filesystem read-only.

**Opções:**

**A) Usar Supabase Storage (Recomendado)**

1. Criar bucket no Supabase:
```sql
-- No Supabase Dashboard → Storage
-- Criar bucket: "noticias-imagens"
-- Políticas: Public read, Authenticated upload
```

2. Atualizar middleware de upload:
```javascript
// backend/middleware/upload.js
const { supabase } = require('../config/supabase');

async function uploadToSupabase(file) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from('noticias-imagens')
        .upload(fileName, file.buffer);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
        .from('noticias-imagens')
        .getPublicUrl(fileName);
    
    return publicUrl;
}
```

**B) Usar serviço externo (Cloudinary, AWS S3, etc.)**

### 3. Porta Dinâmica

O código já está preparado:
```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🧪 TESTAR DEPLOY

### 1. Testar Backend

```bash
curl https://seu-backend.vercel.app/api/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "API funcionando!"
}
```

### 2. Testar Login

```bash
curl -X POST https://seu-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ubatubareage.com.br","senha":"admin123"}'
```

### 3. Testar CORS

Abra o frontend e verifique no console (F12) se há erros de CORS.

---

## 📝 CHECKLIST PRÉ-DEPLOY

- [ ] Backend funcionando localmente
- [ ] Supabase configurado
- [ ] Variáveis de ambiente definidas
- [ ] `.gitignore` configurado (não commitar `.env`)
- [ ] `vercel.json` criado
- [ ] CORS ajustado para produção
- [ ] URLs do frontend atualizadas
- [ ] Testado localmente após mudanças

---

## 🔧 SCRIPTS ÚTEIS

### Atualizar API_URL em todos os arquivos

**PowerShell:**
```powershell
$files = @(
    "admin/js/login.js",
    "admin/js/noticias.js",
    "admin/js/dashboard.js",
    "admin/js/categorias.js",
    "admin/js/newsletter.js"
)

$oldUrl = "http://localhost:3000/api"
$newUrl = "https://seu-backend.vercel.app/api"

foreach ($file in $files) {
    (Get-Content $file) -replace [regex]::Escape($oldUrl), $newUrl | Set-Content $file
}

Write-Host "✅ URLs atualizadas!" -ForegroundColor Green
```

**Bash:**
```bash
files=(
    "admin/js/login.js"
    "admin/js/noticias.js"
    "admin/js/dashboard.js"
    "admin/js/categorias.js"
    "admin/js/newsletter.js"
)

for file in "${files[@]}"; do
    sed -i 's|http://localhost:3000/api|https://seu-backend.vercel.app/api|g' "$file"
done

echo "✅ URLs atualizadas!"
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Function Timeout"

**Causa:** Função executa por mais de 10s (limite gratuito)  
**Solução:** Otimizar queries ou fazer upgrade do plano

### Erro: "Module not found"

**Causa:** Dependência faltando  
**Solução:** 
```bash
cd backend
npm install
git add package.json package-lock.json
git commit -m "Fix: add dependencies"
git push
```

### Erro: "CORS"

**Causa:** Origin não permitida  
**Solução:** Adicionar domínio frontend no CORS do backend

### Erro: "Supabase connection failed"

**Causa:** Variáveis de ambiente não configuradas  
**Solução:** Verificar env vars no dashboard da Vercel

---

## 📊 MONITORAMENTO

### Logs da Vercel

```bash
# Visualizar logs em tempo real
vercel logs seu-deployment-url.vercel.app
```

### Analytics

A Vercel fornece analytics automático:
- Acesse: https://vercel.com/dashboard/analytics
- Veja: Requests, Bandwidth, Edge Network

---

## 🎯 PRÓXIMOS PASSOS

1. **Deploy do Backend** ✅
2. **Atualizar URLs no Frontend** ✅
3. **Deploy do Frontend** ✅
4. **Configurar Domínio Customizado** (opcional)
5. **Configurar CI/CD** (opcional)
6. **Monitoramento e Logs** (opcional)

---

## 🌐 DOMÍNIO CUSTOMIZADO (OPCIONAL)

### Passo 1: Comprar Domínio

Exemplos:
- Registro.br (domínios .br)
- Namecheap
- GoDaddy

### Passo 2: Configurar DNS na Vercel

1. Vercel Dashboard → Settings → Domains
2. Add Domain: `ubatubareage.com.br`
3. Seguir instruções de DNS

### Passo 3: Aguardar Propagação

Pode levar até 48h, mas geralmente é rápido (minutos).

---

## 💰 CUSTOS

### Plano Hobby (Gratuito)

- ✅ 100GB bandwidth/mês
- ✅ Serverless functions
- ✅ SSL automático
- ✅ Deploy ilimitados
- ⚠️ 10s function timeout

### Plano Pro ($20/mês)

- ✅ 1TB bandwidth
- ✅ 60s function timeout
- ✅ Analytics avançado
- ✅ Suporte prioritário

Para este projeto, o **plano gratuito é suficiente**.

---

## ✅ CONCLUSÃO

Após seguir este guia, você terá:

- ✅ Backend rodando na Vercel
- ✅ Frontend acessível
- ✅ Banco Supabase conectado
- ✅ SSL/HTTPS automático
- ✅ Deploy contínuo (se usar GitHub)

**URL Final:**
- Backend: `https://ubatuba-reage-backend.vercel.app`
- Frontend: `https://ubatuba-reage.vercel.app`

---

**Precisa de ajuda?**  
Documentação Vercel: https://vercel.com/docs
