# 🔐 CRIAR USUÁRIO ADMIN MANUALMENTE - Supabase

**Problema:** Row Level Security (RLS) impede criação via código  
**Solução:** Inserir manualmente no dashboard do Supabase

---

## ⚠️ POR QUE PRECISO FAZER MANUAL?

O Supabase está protegido por **políticas de segurança (RLS)** que bloqueiam:
- ❌ Criação de usuários via API
- ❌ Scripts automáticos de seed
- ❌ Inserção via código

**Isso é uma BOA PRÁTICA de segurança!** 🔒

Para criar o primeiro admin, é necessário fazer **manualmente** no dashboard.

---

## 🎯 PASSO A PASSO DETALHADO

### 1️⃣ Acessar Supabase Dashboard

**URL:** https://zrwxxnyygtesucsumzpg.supabase.co

Clique no link e faça login com suas credenciais do Supabase.

### 2️⃣ Navegar para Table Editor

No menu lateral esquerdo:
```
🏠 Home
📊 Table Editor  ← CLIQUE AQUI
🔌 SQL Editor
🔐 Authentication
📱 Edge Functions
...
```

### 3️⃣ Selecionar Tabela 'usuarios'

Na lista de tabelas, procure por:
```
📋 Tabelas:
   - analytics
   - categorias
   - newsletter
   - noticias
   - usuarios  ← CLIQUE AQUI
```

### 4️⃣ Inserir Nova Linha

No canto superior direito da tabela, clique em:
```
[+ Insert row]
```

### 5️⃣ Preencher Campos

**IMPORTANTE:** Copie e cole os valores EXATAMENTE como estão abaixo:

| Campo | Valor |
|-------|-------|
| **id** | *(deixe vazio - será gerado automaticamente)* |
| **nome** | `Admin Site Ubatuba` |
| **email** | `admin@siteubatuba.com.br` |
| **senha** | `$2a$10$Inq376YJd3BpmjzddL6pqOD6FL8OKkxSN0Tl8R9F0l9gX5vqgLE6O` |
| **role** | `admin` |
| **ativo** | `true` |
| **created_at** | *(deixe vazio - será preenchido automaticamente)* |
| **updated_at** | *(deixe vazio - será preenchido automaticamente)* |

**⚠️ CUIDADO ESPECIAL COM A SENHA:**
- É um hash bcrypt da senha `admin123`
- Comece com `$2a$10$`
- Copie EXATAMENTE sem espaços extras
- NÃO digite `admin123` diretamente!

### 6️⃣ Salvar

Depois de preencher todos os campos, clique em:
```
[Save] (botão verde)
```

---

## ✅ VERIFICAÇÃO

Após salvar, você deve ver:

1. **Mensagem de sucesso:** "Row inserted successfully"
2. **Linha na tabela:** Admin aparece na lista
3. **ID gerado:** Número automático na coluna `id`

**Exemplo:**
```
| id | nome              | email                   | role  | ativo |
|----|-------------------|-------------------------|-------|-------|
| 1  | Admin Site Ubatuba| admin@siteubatuba.com.br| admin | true  |
```

---

## 🧪 TESTAR LOGIN

### Depois de criar o admin:

1. **Volte para o site:** já está aberto no navegador
2. **Clique em LOGIN:** menu superior ou hambúrguer
3. **Use as credenciais:**
   - Email: `admin@siteubatuba.com.br`
   - Senha: `admin123` *(senha real, não o hash)*
4. **Clique "Entrar no Painel"**
5. **✅ Dashboard deve abrir!**

---

## 📱 INTERFACE VISUAL

### Como deve aparecer no Supabase:

```
┌─────────────────────────────────────────────────────────┐
│ Supabase Dashboard                                      │
├─────────────────────────────────────────────────────────┤
│ 📊 Table Editor                                         │
│                                                         │
│ Tabela: usuarios                           [+ Insert]   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Nome: [Admin Site Ubatuba              ]            │ │
│ │ Email: [admin@siteubatuba.com.br       ]            │ │
│ │ Senha: [$2a$10$Inq376YJd3BpmjzddL6...  ]            │ │
│ │ Role: [admin                           ]            │ │
│ │ Ativo: ☑ true                                       │ │
│ │                                                     │ │
│ │                              [Cancel] [Save]       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ PROBLEMAS COMUNS

### ❌ "Row insertion failed"

**Causa:** Campo obrigatório vazio ou formato incorreto

**Solução:**
1. Verifique se todos os campos estão preenchidos
2. Email deve ter formato válido: `nome@dominio.com`
3. Role deve ser exatamente: `admin`
4. Ativo deve ser: `true` (não "True" ou "TRUE")

### ❌ "Duplicate key value"

**Causa:** Já existe um usuário com esse email

**Solução:**
1. Use um email diferente: `admin2@siteubatuba.com.br`
2. Ou delete o usuário existente primeiro

### ❌ "Invalid hash format"

**Causa:** Senha hash foi copiada incorretamente

**Solução:**
1. Copie novamente o hash completo
2. Certifique-se que não há espaços no início/fim
3. Deve começar com `$2a$10$`

---

## 🔄 ALTERNATIVA RÁPIDA

Se tiver dificuldades com a interface, use o **SQL Editor**:

### 1. Menu lateral → SQL Editor
### 2. Cole este código:

```sql
INSERT INTO usuarios (nome, email, senha, role, ativo)
VALUES (
    'Admin Site Ubatuba',
    'admin@siteubatuba.com.br',
    '$2a$10$Inq376YJd3BpmjzddL6pqOD6FL8OKkxSN0Tl8R9F0l9gX5vqgLE6O',
    'admin',
    true
);
```

### 3. Clique em "Run" ou Ctrl+Enter

---

## 📊 DADOS TÉCNICOS

### Hash da Senha:
- **Senha original:** `admin123`
- **Algoritmo:** bcrypt
- **Salt rounds:** 10
- **Hash gerado:** `$2a$10$Inq376YJd3BpmjzddL6pqOD6FL8OKkxSN0Tl8R9F0l9gX5vqgLE6O`

### Estrutura da Tabela usuarios:
```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎯 RESULTADO ESPERADO

### Após criar o admin e testar:

```
✅ Admin criado no Supabase
✅ Login funcionando
✅ Dashboard carrega
✅ Pode criar notícias
✅ Todos os recursos disponíveis
```

### Fluxo de teste:
```
1. Criar admin no Supabase ← VOCÊ ESTÁ AQUI
   ↓
2. Voltar ao site
   ↓
3. Clicar em LOGIN
   ↓
4. Usar credenciais: admin@siteubatuba.com.br / admin123
   ↓
5. ✅ Dashboard abre!
   ↓
6. Testar criação de notícia
   ↓
7. ✅ Tudo funcionando!
```

---

## 🚀 APÓS RESOLVER

**Me avise quando terminar!**

Depois que criar o admin, vamos:
1. ✅ Testar o login
2. ✅ Acessar o dashboard
3. ✅ Criar sua primeira notícia
4. ✅ Configurar as variáveis na Vercel
5. ✅ Sistema 100% funcional!

---

## 📞 SUPORTE

### Se tiver dúvidas:

1. **Tire um print** da tela do Supabase
2. **Me envie** para eu ajudar
3. **Ou descreva** exatamente o que aparece

### Links úteis:
- **Supabase Dashboard:** https://zrwxxnyygtesucsumzpg.supabase.co
- **Documentação Supabase:** https://supabase.com/docs
- **Suporte:** suporte@supabase.com

---

**Última atualização:** 30/09/2025  
**Status:** 🔧 Aguardando criação manual do admin  
**Tempo estimado:** 2-5 minutos
