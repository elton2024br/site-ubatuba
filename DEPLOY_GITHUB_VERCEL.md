# 🚀 DEPLOY SITE UBATUBA VIA GITHUB + VERCEL

**Data:** 30/09/2025  
**Método:** GitHub → Vercel (CI/CD Automático)  
**Status:** ✅ Git inicializado, pronto para push

---

## ✅ JÁ CONCLUÍDO

- ✅ Git inicializado
- ✅ `.gitignore` configurado
- ✅ `README.md` atualizado
- ✅ Commit inicial realizado (80 arquivos, 13.171 linhas)
- ✅ Projeto pronto para push

---

## 📋 PRÓXIMOS PASSOS

### 🔹 ETAPA 1: Criar Repositório no GitHub

#### Opção A: Via Interface Web (Mais Fácil)

1. **Acesse:** https://github.com/new

2. **Preencha:**
   - **Repository name:** `site-ubatuba`
   - **Description:** "Portal de notícias local de Ubatuba/SP com CMS completo"
   - **Visibility:** Escolha Public ou Private
   - **❌ NÃO marque** "Initialize with README" (já temos)
   - **❌ NÃO adicione** .gitignore (já temos)
   - **❌ NÃO adicione** license

3. **Clique em:** "Create repository"

4. **Copie a URL** do repositório que aparecerá:
   ```
   https://github.com/seu-usuario/site-ubatuba.git
   ```

#### Opção B: Via GitHub CLI (Avançado)

```bash
# Se tiver GitHub CLI instalado:
gh repo create site-ubatuba --public --source=. --remote=origin
gh repo create site-ubatuba --private --source=. --remote=origin
```

---

### 🔹 ETAPA 2: Fazer Push para o GitHub

Execute estes comandos na raiz do projeto:

```powershell
# Adicionar remote (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/site-ubatuba.git

# Verificar se foi adicionado
git remote -v

# Renomear branch para 'main' (GitHub padrão)
git branch -M main

# Fazer push
git push -u origin main
```

**Exemplo completo:**
```powershell
# Se seu usuário for "joaosilva":
git remote add origin https://github.com/joaosilva/site-ubatuba.git
git branch -M main
git push -u origin main
```

---

### 🔹 ETAPA 3: Conectar Vercel ao GitHub

#### 3.1. Acesse o Dashboard da Vercel

Vá para: https://vercel.com/new

#### 3.2. Importe o Repositório

1. Clique em **"Import Git Repository"**
2. Se ainda não conectou o GitHub:
   - Clique em **"Continue with GitHub"**
   - Autorize a Vercel
3. Selecione o repositório **`site-ubatuba`**
4. Clique em **"Import"**

#### 3.3. Configure o Projeto

**Project Name:**
```
site-ubatuba
```

**Framework Preset:**
```
Other
```

**Root Directory:**
```
./  (raiz do projeto)
```

**Build Command:**
```
(deixe vazio)
```

**Output Directory:**
```
(deixe vazio)
```

**Install Command:**
```
(deixe vazio)
```

#### 3.4. Configure Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

| Key | Value | Environment |
|-----|-------|-------------|
| `SUPABASE_URL` | `https://zrwxxnyygtesucsumzpg.supabase.co` | Production |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3h4bnl5Z3Rlc3Vjc3VtenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwNDEsImV4cCI6MjA3NDc0MTA0MX0.nVmomxqSLSbHamUSFWIQ3W1DfefCAYCBssGhBv63LBQ` | Production |
| `SUPABASE_SERVICE_KEY` | `(mesma key acima)` | Production |
| `JWT_SECRET` | `ubatuba_reage_2025_super_secret_key` | Production |
| `ADMIN_EMAIL` | `admin@siteubatuba.com.br` | Production |
| `ADMIN_PASSWORD` | `admin123` | Production |
| `NODE_ENV` | `production` | Production |

⚠️ **IMPORTANTE:** Clique em **"Add"** para cada variável!

#### 3.5. Deploy!

Clique em **"Deploy"**

A Vercel irá:
1. Clonar seu repositório
2. Detectar a estrutura do projeto
3. Fazer build do backend
4. Fazer deploy
5. Gerar URLs de acesso

**Aguarde ~2-3 minutos**

---

### 🔹 ETAPA 4: Verificar Deploy

Após o deploy, você receberá 3 URLs:

1. **URL de Produção:** `https://site-ubatuba.vercel.app`
2. **URL do Backend:** `https://site-ubatuba.vercel.app/api`
3. **URL do Preview:** `https://site-ubatuba-xxx.vercel.app`

#### Teste os Endpoints:

```powershell
# Health Check
curl https://site-ubatuba.vercel.app/api/health

# Categorias
curl https://site-ubatuba.vercel.app/api/categorias

# Notícias
curl https://site-ubatuba.vercel.app/api/noticias?limit=5
```

---

### 🔹 ETAPA 5: Atualizar URLs no Frontend

⚠️ **IMPORTANTE:** Você precisa atualizar as URLs da API nos arquivos JavaScript do frontend para apontar para a URL de produção.

#### Script Automático (Recomendado)

Execute este comando na raiz do projeto:

```powershell
# Substituir pela sua URL real
.\UPDATE_API_URLS.ps1 "https://site-ubatuba.vercel.app/api"
```

#### Ou Manualmente

Edite estes arquivos e substitua `http://localhost:3000/api` pela URL de produção:

1. **admin/js/login.js**
2. **admin/js/dashboard.js**
3. **admin/js/noticias.js**
4. **admin/js/categorias.js**
5. **admin/js/newsletter.js**
6. **js/main.js**

**Exemplo:**
```javascript
// ANTES:
const API_URL = 'http://localhost:3000/api';

// DEPOIS:
const API_URL = 'https://site-ubatuba.vercel.app/api';
```

#### Comitar as Mudanças

```powershell
git add .
git commit -m "fix: Update API URLs to production"
git push origin main
```

A Vercel fará **redeploy automático** em ~1 minuto! 🚀

---

## 🎉 PRONTO! DEPLOY COMPLETO

Seu site estará disponível em:

- **Frontend:** https://site-ubatuba.vercel.app
- **Admin Panel:** https://site-ubatuba.vercel.app/admin/login.html
- **API:** https://site-ubatuba.vercel.app/api

---

## ⚙️ CI/CD AUTOMÁTICO

Agora, **toda vez que você fizer push** para o GitHub:

```powershell
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main
```

A Vercel automaticamente:
1. ✅ Detecta o push
2. ✅ Faz rebuild
3. ✅ Executa testes (se houver)
4. ✅ Faz deploy
5. ✅ Atualiza as URLs

**Tempo total:** ~2-3 minutos

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### 1. Fazer Mudanças Localmente

```powershell
# Editar arquivos...

# Testar localmente
cd backend
npm start

# Abrir http://localhost:3000
```

### 2. Commitar e Enviar

```powershell
git add .
git commit -m "feat: Adiciona nova feature"
git push origin main
```

### 3. Aguardar Deploy

- Acesse: https://vercel.com/dashboard
- Veja o progresso do deploy em tempo real
- Receba notificação quando concluir

### 4. Testar em Produção

```powershell
curl https://site-ubatuba.vercel.app/api/health
```

---

## 📊 MONITORAMENTO

### Ver Logs em Tempo Real

```powershell
vercel logs site-ubatuba.vercel.app --follow
```

### Ver Deployments Recentes

```powershell
vercel ls
```

### Rollback (Se Necessário)

```powershell
# Listar deployments
vercel ls

# Promover deployment antigo
vercel promote [deployment-url]
```

---

## 🐛 TROUBLESHOOTING

### Erro: "remote: Repository not found"

**Causa:** URL do remote incorreta  
**Solução:**
```powershell
git remote -v  # Verificar URL
git remote set-url origin https://github.com/SEU_USUARIO/site-ubatuba.git
```

### Erro: "src refspec main does not match any"

**Causa:** Branch não renomeada para 'main'  
**Solução:**
```powershell
git branch -M main
git push -u origin main
```

### Erro: Deploy falha na Vercel

**Causa:** Variáveis de ambiente não configuradas  
**Solução:**
1. Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicionar todas as 7 variáveis
3. Settings → Deployments → Redeploy

### Erro: Frontend não conecta com API

**Causa:** URLs não atualizadas  
**Solução:**
```powershell
.\UPDATE_API_URLS.ps1 "https://site-ubatuba.vercel.app/api"
git add .
git commit -m "fix: Update API URLs"
git push
```

---

## ✅ CHECKLIST COMPLETO

- [ ] Repositório criado no GitHub
- [ ] Remote adicionado (`git remote add origin`)
- [ ] Push para GitHub (`git push -u origin main`)
- [ ] Projeto importado na Vercel
- [ ] 7 variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Health check funcionando
- [ ] Categorias funcionando
- [ ] Notícias funcionando
- [ ] URLs atualizadas no frontend
- [ ] Admin panel acessível
- [ ] Login funcionando

---

## 🎯 RESUMO RÁPIDO

```powershell
# 1. Criar repo no GitHub
# https://github.com/new → site-ubatuba

# 2. Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/site-ubatuba.git
git branch -M main
git push -u origin main

# 3. Importar na Vercel
# https://vercel.com/new → Import Git Repository

# 4. Configurar variáveis de ambiente
# (7 variáveis)

# 5. Deploy!

# 6. Atualizar URLs
.\UPDATE_API_URLS.ps1 "https://site-ubatuba.vercel.app/api"
git add .
git commit -m "fix: Update URLs"
git push

# 7. Pronto! 🎉
```

---

## 🔗 LINKS ÚTEIS

- **GitHub:** https://github.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://zrwxxnyygtesucsumzpg.supabase.co
- **Docs Vercel:** https://vercel.com/docs
- **Docs GitHub:** https://docs.github.com

---

**Última atualização:** 30/09/2025  
**Status:** ✅ Pronto para deploy!
