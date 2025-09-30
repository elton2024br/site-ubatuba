# 🔧 FIX: Error 500 - FUNCTION_INVOCATION_FAILED

**Erro:** `500: INTERNAL_SERVER_ERROR - FUNCTION_INVOCATION_FAILED`  
**Data:** 30/09/2025  
**Status:** ✅ CORRIGIDO

---

## 🐛 PROBLEMA IDENTIFICADO

A Vercel estava crashando porque:

1. **App Express não exportado** 
   - O `server.js` usava `app.listen()` mas não exportava o `app`
   - Vercel precisa de `module.exports = app` para serverless functions

2. **Estrutura de arquivos**
   - Vercel requer um arquivo em `/api/` ou export direto

---

## ✅ CORREÇÕES APLICADAS

### 1. Atualizado `backend/server.js`

**Antes:**
```javascript
// Iniciar servidor
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log('Servidor rodando...');
});
```

**Depois:**
```javascript
// Iniciar servidor (apenas em desenvolvimento local)
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    const PORT = config.PORT;
    app.listen(PORT, () => {
        console.log('Servidor rodando...');
    });
}

// Exportar app para Vercel (serverless)
module.exports = app;
```

### 2. Criado `backend/api/index.js`

```javascript
// Arquivo necessário para Vercel serverless
module.exports = require('../server.js');
```

### 3. Atualizado `backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## 🚀 COMO APLICAR O FIX

### Se já fez deploy:

```bash
cd backend

# Pull das mudanças (se usar git)
git pull

# OU aplicar mudanças manualmente

# Redeploy
vercel --prod
```

### Se ainda não fez deploy:

As mudanças já estão aplicadas! Pode fazer o deploy normalmente:

```bash
cd backend
vercel --prod
```

---

## 🧪 TESTAR APÓS FIX

### 1. Health Check
```bash
curl https://sua-url.vercel.app/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API Ubatuba Reage está funcionando!",
  "version": "1.0.0",
  "timestamp": "2025-09-30T..."
}
```

### 2. Login
```bash
curl -X POST https://sua-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ubatubareage.com.br","senha":"admin123"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJI...",
    "user": {...}
  }
}
```

---

## 📊 OUTROS ERROS COMUNS E SOLUÇÕES

### Erro: "Cannot find module"

**Causa:** Dependência faltando  
**Solução:**
```bash
cd backend
npm install
git add package-lock.json
git commit -m "Update dependencies"
vercel --prod
```

### Erro: "Function timeout"

**Causa:** Função executa por mais de 10s  
**Solução:** Já configurado com `maxDuration: 10` no vercel.json

### Erro: "Environment variable not found"

**Causa:** Variáveis de ambiente não configuradas  
**Solução:**
1. Acesse: https://vercel.com/dashboard
2. Seu projeto → Settings → Environment Variables
3. Adicione todas as variáveis (veja `ENV_PRODUCTION_EXAMPLE.txt`)

### Erro: "Cannot read property of undefined"

**Causa:** Código tentando acessar propriedade que não existe  
**Solução:** Verifique os logs:
```bash
vercel logs sua-url.vercel.app
```

---

## 🔍 DEBUG DE ERROS FUTUROS

### Ver Logs em Tempo Real

```bash
vercel logs sua-url.vercel.app --follow
```

### Verificar Build

```bash
vercel logs sua-url.vercel.app --since 1h
```

### Testar Localmente Antes

```bash
cd backend

# Simular produção
export NODE_ENV=production
node server.js

# Testar
curl http://localhost:3000/api/health
```

---

## ✅ CHECKLIST PÓS-FIX

- [ ] Arquivos atualizados (`server.js`, `vercel.json`, `api/index.js`)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado (`vercel --prod`)
- [ ] Health check funcionando
- [ ] Login funcionando
- [ ] Sem erros nos logs
- [ ] Frontend consegue se conectar

---

## 📝 ESTRUTURA FINAL

```
backend/
├── api/
│   └── index.js          ← Novo! Entry point Vercel
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js             ← Atualizado! Exporta app
├── vercel.json           ← Atualizado! Aponta para api/
└── package.json
```

---

## 🎯 VERIFICAÇÃO FINAL

Execute este comando após deploy:

```bash
# Substituir pela sua URL
URL="https://sua-url.vercel.app"

echo "🧪 Testando backend..."

# Health
curl -s $URL/api/health | grep -q "success" && echo "✅ Health OK" || echo "❌ Health FALHOU"

# Login
TOKEN=$(curl -s -X POST $URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ubatubareage.com.br","senha":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Login OK"
    echo "✅ Token: ${TOKEN:0:20}..."
else
    echo "❌ Login FALHOU"
fi

# Categorias
curl -s $URL/api/categorias | grep -q "Cidade" && echo "✅ Categorias OK" || echo "❌ Categorias FALHOU"

echo ""
echo "🎉 Testes concluídos!"
```

---

## 💡 DICAS

1. **Sempre teste localmente primeiro**
   ```bash
   NODE_ENV=production node server.js
   ```

2. **Use logs para debug**
   ```bash
   vercel logs --follow
   ```

3. **Verifique variáveis de ambiente**
   ```bash
   vercel env ls
   ```

4. **Cache pode causar problemas**
   - Force rebuild: Settings → Deployments → Redeploy

---

## 🎉 CONCLUSÃO

Após aplicar essas correções, o backend estará funcionando na Vercel!

**Próximos passos:**
1. Aplicar fix
2. Redeploy
3. Testar endpoints
4. Atualizar frontend com nova URL

---

**Data da correção:** 30/09/2025  
**Status:** ✅ RESOLVIDO
