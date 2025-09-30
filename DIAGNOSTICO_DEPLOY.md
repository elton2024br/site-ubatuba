# 🔍 DIAGNÓSTICO DO DEPLOY - Site Ubatuba

**Data:** 30/09/2025 05:27  
**Status:** 🟡 Parcialmente Funcional

---

## 🧪 TESTES REALIZADOS

| Endpoint | Status | Detalhes |
|----------|--------|----------|
| `/api/health` | ✅ **OK** | API respondendo |
| `/api/categorias` | ❌ **500** | Erro ao consultar Supabase |
| `/api/noticias` | ❌ **500** | Erro ao consultar Supabase |
| `/api/auth/login` | ❌ **500** | Erro ao consultar Supabase |

---

## 🔍 ANÁLISE

### ✅ O que está funcionando:

- ✅ Deploy realizado com sucesso
- ✅ Servidor Node.js iniciando
- ✅ Health check respondendo
- ✅ Roteamento funcionando

### ❌ O que NÃO está funcionando:

- ❌ Conexão com Supabase
- ❌ Queries ao banco de dados
- ❌ Autenticação JWT

---

## 🐛 CAUSA RAIZ

**Variáveis de ambiente do Supabase não configuradas na Vercel!**

O backend precisa dessas variáveis para conectar ao Supabase:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
NODE_ENV
```

**Sem elas, o código tenta conectar mas falha.**

---

## 🔧 SOLUÇÃO

Você precisa configurar as variáveis de ambiente no dashboard da Vercel.

### Opção 1: Via Dashboard (Recomendado)

1. **Acesse:** https://vercel.com/elton2024brs-projects/site-ubatuba
2. **Vá em:** Settings → Environment Variables
3. **Adicione cada variável:**

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | `https://zrwxxnyygtesucsumzpg.supabase.co` | Production |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ` | Production |
| `SUPABASE_SERVICE_KEY` | (mesmo valor acima) | Production |
| `JWT_SECRET` | `ubatuba_reage_2025_super_secret_key` | Production |
| `ADMIN_EMAIL` | `admin@siteubatuba.com.br` | Production |
| `ADMIN_PASSWORD` | `admin123` | Production |
| `NODE_ENV` | `production` | Production |

4. **Clique em "Save"** para cada uma
5. **Vá em:** Deployments → Latest → ⋯ → **Redeploy**

### Opção 2: Via CLI

```bash
cd backend

# Adicionar cada variável
vercel env add SUPABASE_URL production
# Cole: https://zrwxxnyygtesucsumzpg.supabase.co

vercel env add SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add SUPABASE_SERVICE_KEY production
# Cole: (mesmo valor acima)

vercel env add JWT_SECRET production
# Cole: ubatuba_reage_2025_super_secret_key

vercel env add ADMIN_EMAIL production
# Cole: admin@siteubatuba.com.br

vercel env add ADMIN_PASSWORD production
# Cole: admin123

vercel env add NODE_ENV production
# Cole: production

# Redeploy
vercel --prod
```

---

## ⏰ TEMPO ESTIMADO

**5-10 minutos** para:
- Adicionar 7 variáveis (5 min)
- Redeploy automático (2-3 min)
- Testar endpoints (2 min)

---

## 🧪 VALIDAR APÓS CORREÇÃO

Execute estes comandos após configurar as variáveis:

```powershell
$URL = "https://site-ubatuba.vercel.app"

# Health Check
curl "$URL/api/health"
# ✅ Deve retornar: { "success": true, "message": "..." }

# Categorias
curl "$URL/api/categorias"
# ✅ Deve retornar: { "success": true, "data": [...] }

# Notícias
curl "$URL/api/noticias?limit=3"
# ✅ Deve retornar: { "success": true, "data": [...] }

# Login
curl -X POST "$URL/api/auth/login" `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@siteubatuba.com.br","senha":"admin123"}'
# ✅ Deve retornar: { "success": true, "data": { "token": "..." } }
```

---

## 📊 RESULTADO ESPERADO

Após configurar as variáveis:

| Endpoint | Antes | Depois |
|----------|-------|--------|
| `/api/health` | ✅ 200 | ✅ 200 |
| `/api/categorias` | ❌ 500 | ✅ 200 |
| `/api/noticias` | ❌ 500 | ✅ 200 |
| `/api/auth/login` | ❌ 500 | ✅ 200 |

**Status:** 🟢 **100% Funcional**

---

## 🎯 PASSO A PASSO VISUAL

### 1. Acesse o Dashboard

```
https://vercel.com/elton2024brs-projects/site-ubatuba
```

### 2. Clique em "Settings"

```
Projects > site-ubatuba > Settings
```

### 3. Clique em "Environment Variables"

```
Settings > Environment Variables > Add New
```

### 4. Adicione uma por uma

```
Name:  SUPABASE_URL
Value: https://zrwxxnyygtesucsumzpg.supabase.co
Environment: Production
[Add]
```

Repita para todas as 7 variáveis.

### 5. Redeploy

```
Deployments > Latest Deployment > ⋯ > Redeploy
```

Ou simplesmente aguarde ~1 minuto (a Vercel detecta mudanças).

---

## 💡 DICAS

### Ver Logs em Tempo Real

```bash
vercel logs site-ubatuba.vercel.app --follow
```

### Verificar Variáveis Configuradas

```bash
vercel env ls
```

### Testar Localmente Primeiro

```bash
cd backend
cp .env.example .env
# Editar .env com valores corretos
npm start
```

---

## 🔗 LINKS ÚTEIS

- **Dashboard Vercel:** https://vercel.com/elton2024brs-projects/site-ubatuba
- **Settings:** https://vercel.com/elton2024brs-projects/site-ubatuba/settings
- **Env Vars:** https://vercel.com/elton2024brs-projects/site-ubatuba/settings/environment-variables
- **Deployments:** https://vercel.com/elton2024brs-projects/site-ubatuba/deployments
- **Supabase Dashboard:** https://zrwxxnyygtesucsumzpg.supabase.co

---

## ⚠️ IMPORTANTE

**NÃO commite o arquivo `.env` no Git!**

O `.gitignore` já está configurado para ignorar:
```
.env
.env.local
.env.production
backend/.env
```

✅ Variáveis de ambiente devem estar **apenas** no dashboard da Vercel.

---

## 📝 RESUMO

**Problema:** Variáveis de ambiente não configuradas  
**Solução:** Adicionar no dashboard da Vercel  
**Tempo:** 5-10 minutos  
**Resultado:** 100% funcional  

---

**Última atualização:** 30/09/2025 05:27  
**Próxima ação:** Configurar variáveis de ambiente na Vercel

