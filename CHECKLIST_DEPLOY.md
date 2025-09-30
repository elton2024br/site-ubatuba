# ✅ CHECKLIST DE DEPLOY NA VERCEL

**Projeto:** Ubatuba Reage  
**Data:** 30/09/2025

---

## 📋 PRÉ-DEPLOY

- [ ] Backend funcionando localmente (`npm start`)
- [ ] Supabase configurado e acessível
- [ ] Testes passando (`node test-admin-flow.js`)
- [ ] Variáveis de ambiente documentadas
- [ ] `.gitignore` configurado

---

## 🔧 CONFIGURAÇÃO

- [x] ✅ `vercel.json` criado (raiz)
- [x] ✅ `backend/vercel.json` criado
- [x] ✅ `.vercelignore` criado
- [x] ✅ `backend/.vercelignore` criado
- [x] ✅ Guia de deploy criado (`DEPLOY_VERCEL.md`)
- [x] ✅ Script de atualização criado (`UPDATE_API_URLS.ps1`)

---

## 🚀 DEPLOY DO BACKEND

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```
- [ ] Vercel CLI instalado

### Passo 2: Login
```bash
vercel login
```
- [ ] Login realizado

### Passo 3: Deploy de Teste
```bash
cd backend
vercel
```
- [ ] Deploy de teste concluído
- [ ] URL de teste anotada: `____________________________`

### Passo 4: Configurar Variáveis de Ambiente

No dashboard da Vercel (https://vercel.com/dashboard):

- [ ] `SUPABASE_URL` adicionada
- [ ] `SUPABASE_ANON_KEY` adicionada
- [ ] `SUPABASE_SERVICE_KEY` adicionada
- [ ] `JWT_SECRET` adicionada
- [ ] `ADMIN_EMAIL` adicionada
- [ ] `ADMIN_PASSWORD` adicionada
- [ ] `NODE_ENV=production` adicionada

**OU via CLI:**
```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add JWT_SECRET production
vercel env add ADMIN_EMAIL production
vercel env add ADMIN_PASSWORD production
vercel env add NODE_ENV production
```

### Passo 5: Deploy para Produção
```bash
vercel --prod
```
- [ ] Deploy de produção concluído
- [ ] URL de produção anotada: `____________________________`

### Passo 6: Testar Backend

```bash
curl https://sua-url.vercel.app/api/health
```

- [ ] Endpoint `/api/health` respondendo
- [ ] Retorna `{"success": true}`

---

## 🎨 ATUALIZAR FRONTEND

### Passo 7: Atualizar URLs da API

**Opção A: Script Automático (Recomendado)**
```powershell
.\UPDATE_API_URLS.ps1 -NewApiUrl "https://sua-url.vercel.app/api"
```

**Opção B: Manual**

Editar os seguintes arquivos e trocar:
- De: `http://localhost:3000/api`
- Para: `https://sua-url.vercel.app/api`

- [ ] `admin/js/login.js` atualizado
- [ ] `admin/js/noticias.js` atualizado
- [ ] `admin/js/dashboard.js` atualizado
- [ ] `admin/js/categorias.js` atualizado
- [ ] `admin/js/newsletter.js` atualizado
- [ ] `js/main.js` atualizado (se usar API no site público)

### Passo 8: Atualizar CORS no Backend

Editar `backend/server.js`:

```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://seu-frontend.vercel.app',
            'https://ubatuba-reage.vercel.app'
          ]
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

- [ ] CORS atualizado
- [ ] Commit feito: `git commit -am "Update CORS for production"`
- [ ] Redeployed: `vercel --prod` (no backend)

---

## 🌐 DEPLOY DO FRONTEND

### Passo 9: Deploy do Frontend

```bash
cd ..  # Voltar para raiz
vercel --prod
```

- [ ] Frontend deployado
- [ ] URL frontend anotada: `____________________________`

### Passo 10: Testar Frontend

- [ ] Abrir URL do frontend
- [ ] Admin Panel carrega: `https://seu-frontend.vercel.app/admin/login.html`
- [ ] Fazer login funciona
- [ ] Sem erros de CORS no console (F12)
- [ ] Listar notícias funciona
- [ ] Criar notícia funciona
- [ ] Deletar notícia funciona

---

## ⚠️ UPLOAD DE IMAGENS (IMPORTANTE)

⚠️ **A Vercel tem filesystem read-only!**

Escolha uma opção:

### Opção A: Supabase Storage (Recomendado)

1. Criar bucket no Supabase:
   - [ ] Acesse Supabase Dashboard → Storage
   - [ ] Criar bucket: `noticias-imagens`
   - [ ] Configurar como público (public read)

2. Atualizar código de upload:
   - [ ] Modificar `backend/middleware/upload.js`
   - [ ] Usar `supabase.storage.from('noticias-imagens').upload()`
   - [ ] Retornar URL pública

### Opção B: Cloudinary/AWS S3

- [ ] Criar conta no serviço escolhido
- [ ] Configurar credenciais
- [ ] Atualizar código de upload

### Opção C: Desabilitar Upload (Temporário)

- [ ] Remover botão de upload no admin
- [ ] Usar URLs de imagens externas

---

## 🧪 TESTES FINAIS

### Teste 1: Backend Health
```bash
curl https://seu-backend.vercel.app/api/health
```
- [ ] ✅ Status 200
- [ ] ✅ Retorna JSON com success: true

### Teste 2: Login
```bash
curl -X POST https://seu-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ubatubareage.com.br","senha":"admin123"}'
```
- [ ] ✅ Retorna token JWT
- [ ] ✅ Dados do usuário corretos

### Teste 3: Listar Categorias
- [ ] ✅ GET /api/categorias funciona
- [ ] ✅ Retorna 6 categorias

### Teste 4: Listar Notícias
- [ ] ✅ GET /api/noticias funciona
- [ ] ✅ Notícias aparecem

### Teste 5: CORS
- [ ] ✅ Sem erros de CORS no console
- [ ] ✅ Requests do frontend funcionam

### Teste 6: Criar Notícia (Admin Panel)
- [ ] ✅ Login no admin funciona
- [ ] ✅ Formulário carrega
- [ ] ✅ Criar notícia funciona
- [ ] ✅ Notícia aparece na lista

---

## 📊 MONITORAMENTO

### Logs e Analytics

- [ ] Acessar logs: https://vercel.com/dashboard
- [ ] Verificar erros (se houver)
- [ ] Analytics habilitado

### Supabase Monitoring

- [ ] Verificar conexões no Supabase Dashboard
- [ ] Checar uso de API requests
- [ ] Monitorar storage (se usar)

---

## 🎯 DOMÍNIO CUSTOMIZADO (OPCIONAL)

- [ ] Domínio adquirido: `____________________________`
- [ ] DNS configurado na Vercel
- [ ] SSL ativo
- [ ] Domínio propagado

---

## 📝 DOCUMENTAÇÃO

- [ ] URLs de produção documentadas
- [ ] Credenciais de admin atualizadas (se mudou)
- [ ] README.md atualizado com URLs de produção
- [ ] Equipe notificada sobre novo deploy

---

## ✅ CONCLUSÃO

- [ ] ✅ Backend em produção e funcional
- [ ] ✅ Frontend em produção e funcional
- [ ] ✅ Banco Supabase conectado
- [ ] ✅ SSL/HTTPS ativo
- [ ] ✅ Admin Panel acessível
- [ ] ✅ Sistema testado end-to-end
- [ ] ✅ Sem erros críticos

---

## 🎉 DEPLOY COMPLETO!

**URLs Finais:**

- Backend API: `https://____________________________`
- Frontend: `https://____________________________`
- Admin Panel: `https://____________________________/admin/login.html`

**Credenciais:**
- Email: `admin@ubatubareage.com.br`
- Senha: `admin123`

---

**Data do deploy:** ____________________  
**Responsável:** ____________________  
**Status:** ⬜ Em progresso | ⬜ Concluído com sucesso
