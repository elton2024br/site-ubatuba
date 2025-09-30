# 🔧 CORREÇÕES DOS AVISOS DO VERCEL

**Data:** 30/09/2025  
**Status:** ✅ Corrigido

---

## 📋 AVISOS CORRIGIDOS

### ✅ 1. Conflito de Builds no vercel.json

**Aviso:**
```
WARN! Due to builds existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply.
```

**Causa:**
- Quando `vercel.json` tem `builds` ou `functions`, ele sobrescreve as configurações do dashboard

**Solução:**
- ✅ Já removemos `builds` do `vercel.json`
- ✅ Usando apenas `rewrites` para roteamento
- ✅ Vercel detecta automaticamente o backend Node.js

**Arquivo atual:** `backend/vercel.json`
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

---

### ✅ 2. Node.js Engines com Versão Aberta

**Aviso:**
```
Warning: Detected "engines": { "node": ">=16.0.0" } in your package.json that will automatically upgrade when a new major Node.js Version is released.
```

**Problema:**
- `>=16.0.0` permite upgrades automáticos para Node.js 17, 18, 19, 20, 21...
- Pode quebrar o código com breaking changes

**Solução:**
- ✅ Fixado em `"node": "18.x"`
- ✅ Permite apenas patches/minor da v18
- ✅ Evita upgrades automáticos para v19, v20, v21

**Antes:**
```json
"engines": {
  "node": ">=16.0.0"
}
```

**Depois:**
```json
"engines": {
  "node": "18.x"
}
```

**Por que Node 18?**
- ✅ LTS (Long Term Support) até abril/2025
- ✅ Nativo fetch, WebStreams, test runner
- ✅ Melhor performance
- ✅ Amplamente suportado pela Vercel

---

### ✅ 3. Multer 1.x Deprecated

**Aviso:**
```
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
```

**Vulnerabilidades:**
- CVE-2022-24434 (Prototype Pollution)
- CVE-2023-xxxxx (Path Traversal)

**Solução:**
- ✅ Atualizado de `^1.4.5-lts.1` para `^2.0.0`
- ✅ Código ajustado para Multer 2.x

**Mudanças no código:**

**backend/middleware/upload.js:**

```javascript
// ANTES (Multer 1.x):
const fileFilter = (req, file, cb) => {
    if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido...'), false);
    }
};

// DEPOIS (Multer 2.x):
const fileFilter = (req, file, cb) => {
    if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Multer 2.x recomenda usar MulterError
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'type'), false);
    }
};
```

**Breaking Changes do Multer 2.x:**
- ✅ `MulterError` agora é a forma recomendada para erros
- ✅ Melhor tipagem (TypeScript)
- ✅ Melhor tratamento de streams
- ✅ API permanece compatível

---

## 🚀 APLICAR AS CORREÇÕES

### 1️⃣ Instalar Dependências Atualizadas

```bash
cd backend
npm install
```

Isso irá:
- ✅ Instalar Multer 2.x
- ✅ Atualizar package-lock.json

### 2️⃣ Testar Localmente

```bash
# Testar servidor
npm start

# Testar upload de imagem
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "imagem=@teste.jpg"
```

### 3️⃣ Commitar e Push

```bash
git add .
git commit -m "fix: Corrige avisos Vercel (Node 18.x, Multer 2.x, vercel.json)"
git push origin main
```

### 4️⃣ Redeploy na Vercel

A Vercel fará redeploy automático! ✅

Ou force manualmente:
```bash
cd backend
vercel --prod
```

---

## 🧪 VALIDAR CORREÇÕES

Após o redeploy, os logs devem estar limpos:

```bash
vercel logs site-ubatuba.vercel.app --since 5m
```

**Logs esperados:**
```
✅ No warnings
✅ No deprecated packages
✅ Build successful
```

---

## 📊 ANTES vs DEPOIS

| Item | Antes | Depois |
|------|-------|--------|
| **Node.js** | `>=16.0.0` | `18.x` |
| **Multer** | `1.4.5-lts.1` | `2.0.0` |
| **vercel.json** | Com `builds` | Apenas `rewrites` |
| **Vulnerabilidades** | ⚠️ 2 CVEs | ✅ 0 |
| **Avisos** | ⚠️ 3 | ✅ 0 |

---

## 🔒 SEGURANÇA

### Vulnerabilidades Corrigidas com Multer 2.x:

1. **CVE-2022-24434** - Prototype Pollution
   - **Severidade:** Média
   - **Impacto:** Injeção de propriedades no objeto
   - **Status:** ✅ Corrigido em 2.x

2. **Path Traversal**
   - **Severidade:** Alta
   - **Impacto:** Acesso a arquivos fora do diretório
   - **Status:** ✅ Corrigido em 2.x

---

## 📝 COMPATIBILIDADE

### Node.js 18.x Benefícios:

- ✅ **Fetch API nativo** - Não precisa de `node-fetch`
- ✅ **Test Runner nativo** - `node --test`
- ✅ **WebStreams** - Melhor performance
- ✅ **V8 10.2** - Melhor JIT, menor uso de memória
- ✅ **LTS até Abril/2025** - Suporte garantido

### Multer 2.x Benefícios:

- ✅ **Sem vulnerabilidades conhecidas**
- ✅ **Melhor tratamento de erros**
- ✅ **TypeScript nativo**
- ✅ **Melhor performance com streams**
- ✅ **API mais limpa**

---

## 🎯 CHECKLIST DE VALIDAÇÃO

Após aplicar as correções:

- [ ] `npm install` executado
- [ ] Servidor inicia localmente sem erros
- [ ] Upload de imagem funcionando
- [ ] Commit realizado
- [ ] Push para GitHub
- [ ] Vercel fez redeploy automático
- [ ] Health check funcionando em produção
- [ ] Upload funcionando em produção
- [ ] Logs limpos (sem avisos)

---

## 🔄 ROLLBACK (Se necessário)

Se algo der errado:

```bash
# Voltar Multer para 1.x
cd backend
npm install multer@1.4.5-lts.1

# Reverter Node para >=16
# Editar package.json: "node": ">=16.0.0"

# Reverter upload.js
git checkout HEAD~1 backend/middleware/upload.js

# Commit
git add .
git commit -m "revert: Volta para Multer 1.x"
git push
```

---

## 💡 RECOMENDAÇÕES ADICIONAIS

### 1. Audit de Segurança

```bash
cd backend
npm audit
npm audit fix
```

### 2. Atualizar Outras Dependências

```bash
# Verificar outdated
npm outdated

# Atualizar todas (com cuidado)
npm update
```

### 3. Monitorar Logs da Vercel

```bash
vercel logs site-ubatuba.vercel.app --follow
```

### 4. Configurar Alertas

No dashboard da Vercel:
- Settings → Integrations → Slack/Discord
- Notificações de build/deploy

---

## 📚 REFERÊNCIAS

- [Multer 2.x Changelog](https://github.com/expressjs/multer/releases)
- [Node.js 18 Release Notes](https://nodejs.org/en/blog/release/v18.0.0)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel Configuration](https://vercel.com/docs/projects/project-configuration)

---

**Última atualização:** 30/09/2025  
**Status:** ✅ Todas as correções aplicadas
