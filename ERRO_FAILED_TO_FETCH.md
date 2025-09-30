# ⚠️ ERRO: Failed to fetch

**Problema Comum:** "Failed to fetch"  
**Solução Rápida:** Iniciar o backend

---

## 🔍 O QUE SIGNIFICA?

**"Failed to fetch"** é um erro do JavaScript que significa:

> "O navegador tentou buscar dados de um servidor, mas não conseguiu conectar."

No nosso caso, o site (frontend) está tentando se comunicar com a API (backend), mas o servidor backend não está respondendo.

---

## 🐛 CAUSAS COMUNS

### 1. Backend Não Está Rodando ⚠️ (Mais Comum)

**Sintoma:**
- Site abre normalmente
- Ao clicar em "Login" → "Failed to fetch"
- Ou ao carregar notícias → "Failed to fetch"

**Causa:**
- O servidor Node.js não foi iniciado
- Porta 3000 não está em uso

**Solução:**
```powershell
cd backend
npm start
```

Aguarde ver:
```
Servidor rodando em http://localhost:3000
```

---

### 2. URL da API Incorreta

**Sintoma:**
- Backend rodando
- Mas ainda dá "Failed to fetch"

**Causa:**
- Frontend tentando conectar na URL errada
- Ex: Frontend busca `http://localhost:5000` mas backend roda em `http://localhost:3000`

**Solução:**
Verificar arquivos de configuração:

**Arquivo:** `admin/js/login.js` (e outros .js no admin)
```javascript
// Deve ser:
const API_URL = 'http://localhost:3000/api';

// OU (para produção):
const API_URL = 'https://site-ubatuba.vercel.app/api';
```

---

### 3. Problema de CORS

**Sintoma:**
- Console do navegador mostra:
  ```
  Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'null' 
  has been blocked by CORS policy
  ```

**Causa:**
- Backend não permite requisições do frontend
- Configuração de CORS restritiva

**Solução:**
**Arquivo:** `backend/server.js`
```javascript
// Configuração para desenvolvimento (aceita qualquer origem)
app.use(cors({
    origin: '*',  // Aceita todas as origens
    credentials: true
}));

// OU para produção (específico)
app.use(cors({
    origin: [
        'http://localhost:5500',
        'https://site-ubatuba.vercel.app'
    ],
    credentials: true
}));
```

---

### 4. Firewall Bloqueando

**Sintoma:**
- Backend rodando
- URLs corretas
- Mas ainda não conecta

**Causa:**
- Firewall do Windows bloqueando porta 3000
- Antivírus bloqueando Node.js

**Solução:**
1. Windows Defender Firewall
2. Configurações avançadas
3. Regras de entrada
4. Nova regra → Porta → TCP 3000 → Permitir

---

### 5. Porta 3000 Já em Uso

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causa:**
- Outra instância do servidor rodando
- Outro programa usando porta 3000

**Solução:**
```powershell
# Encontrar processo na porta 3000
netstat -ano | findstr :3000

# Resultado exemplo:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
#                                                    ↑ PID

# Matar processo (substitua 12345 pelo PID real)
taskkill /PID 12345 /F

# Ou usar porta diferente
# backend/server.js:
const PORT = process.env.PORT || 3001;  # Mudar para 3001
```

---

## ✅ SOLUÇÃO RÁPIDA (CHECKLIST)

Execute na ordem:

### 1️⃣ Verificar se Backend Está Rodando

```powershell
# Testar se porta 3000 está aberta
Test-NetConnection -ComputerName localhost -Port 3000
```

**Resultado esperado:**
```
TcpTestSucceeded : True
```

**Se der False:** Backend não está rodando → Inicie:
```powershell
cd backend
npm start
```

---

### 2️⃣ Testar API Manualmente

```powershell
# Testar health check
curl http://localhost:3000/api/health
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "API Ubatuba Reage está funcionando!",
  "version": "1.0.0"
}
```

**Se der erro:** Backend tem problema → Veja logs no terminal

---

### 3️⃣ Verificar Console do Navegador

1. Abra o site
2. Pressione `F12` (DevTools)
3. Aba "Console"
4. Tente fazer login
5. Veja mensagens de erro

**Erros comuns:**
- `Failed to fetch` → Backend não rodando
- `CORS policy` → Problema de CORS
- `404 Not Found` → Rota não existe
- `500 Internal Server Error` → Erro no servidor

---

### 4️⃣ Testar Login

```powershell
# Testar login via curl
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@siteubatuba.com.br","senha":"admin123"}'
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

---

## 🎯 FLUXO DE TESTE COMPLETO

### Passo a Passo:

```
1. Iniciar Backend
   ↓
   cd backend
   npm start
   ↓
   Aguardar: "Servidor rodando..."
   ↓
2. Testar API
   ↓
   curl http://localhost:3000/api/health
   ↓
   Deve retornar JSON com success: true
   ↓
3. Abrir Site
   ↓
   start index.html
   ↓
   Site abre no navegador
   ↓
4. Clicar em LOGIN
   ↓
   Menu → LOGIN ou ☰ → ÁREA ADMIN
   ↓
   Página de login abre
   ↓
5. Fazer Login
   ↓
   Email: admin@siteubatuba.com.br
   Senha: admin123
   ↓
   Clicar "Entrar no Painel"
   ↓
6. ✅ Dashboard abre!
```

---

## 📊 TABELA DE DIAGNÓSTICO

| Sintoma | Causa Provável | Solução |
|---------|----------------|---------|
| Failed to fetch | Backend não rodando | `cd backend; npm start` |
| CORS policy | Configuração CORS | Alterar `server.js` |
| 404 Not Found | Rota não existe | Verificar `routes/` |
| 500 Server Error | Erro no código | Ver logs do backend |
| EADDRINUSE | Porta em uso | Matar processo ou mudar porta |
| Timeout | Firewall bloqueando | Liberar porta 3000 |

---

## 🔧 COMANDOS ÚTEIS

### Iniciar Backend:
```powershell
cd backend
npm start
```

### Parar Backend:
```
Ctrl + C (no terminal do backend)
```

### Ver Processos na Porta 3000:
```powershell
netstat -ano | findstr :3000
```

### Matar Processo:
```powershell
taskkill /PID [PID_AQUI] /F
```

### Testar API:
```powershell
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@siteubatuba.com.br","senha":"admin123"}'

# Categorias
curl http://localhost:3000/api/categorias
```

### Ver Logs:
```powershell
# Logs do backend (terminal onde rodou npm start)
# Ou ver arquivo de log se configurado
```

---

## 💡 PREVENÇÃO

### Sempre Antes de Usar o Site Localmente:

1. **Abra um terminal dedicado ao backend**
2. **Rode:** `cd backend; npm start`
3. **Deixe rodando** (não feche o terminal)
4. **Abra outro terminal** para outros comandos
5. **Só feche** quando terminar de usar o site

### Automatizar (Opcional):

Crie um script `start.ps1`:
```powershell
# start.ps1
Write-Host "Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

Start-Sleep -Seconds 5

Write-Host "Abrindo Site..." -ForegroundColor Green
start index.html

Write-Host "Tudo pronto!" -ForegroundColor Green
```

Uso:
```powershell
.\start.ps1
```

---

## 🌐 AMBIENTE ONLINE (Vercel)

### Para Produção:

**NÃO TERÁ** esse erro se:
1. ✅ Variáveis de ambiente configuradas
2. ✅ Deploy realizado com sucesso
3. ✅ Site acessado via HTTPS

**Pode ter** esse erro se:
- ❌ Variáveis não configuradas
- ❌ Build falhou
- ❌ Supabase offline
- ❌ Limite de requisições atingido

**Como verificar online:**
```powershell
# Testar API online
curl https://site-ubatuba.vercel.app/api/health
```

---

## 📚 DOCUMENTAÇÃO RELACIONADA

- **`COMO_CRIAR_NOTICIAS.md`** - Como usar o painel
- **`DIAGNOSTICO_DEPLOY.md`** - Problemas de deploy
- **`PAINEL_ADMIN_COMPLETO.md`** - Guia do painel
- **`STATUS_FINAL_DEPLOY.md`** - Status geral

---

## ✅ RESUMO

**Erro:** Failed to fetch  
**Causa Mais Comum:** Backend não está rodando  
**Solução Rápida:** `cd backend; npm start`  
**Tempo:** 5 segundos  

**Lembre-se:** Para usar o site **localmente**, o backend **SEMPRE** precisa estar rodando!

---

**Última atualização:** 30/09/2025  
**Status:** ✅ Backend rodando  
**Porta:** 3000  
**API:** http://localhost:3000/api
