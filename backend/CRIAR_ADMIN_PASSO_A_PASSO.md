# 🔐 CRIAR ADMIN - PASSO A PASSO DEFINITIVO

**DIAGNÓSTICO:** Tabela `usuarios` está vazia (0 registros)  
**PROBLEMA:** Admin não foi criado corretamente  
**SOLUÇÃO:** Seguir este guia EXATAMENTE

---

## ⚠️ ANTES DE COMEÇAR

**IMPORTANTE:** Vamos fazer passo a passo com verificações. **NÃO PULE NENHUMA ETAPA!**

---

## 🎯 PASSO 1: VERIFICAR SE ADMIN EXISTE

### 1.1 Acessar Supabase

**URL:** https://zrwxxnyygtesucsumzpg.supabase.co

### 1.2 Fazer Login

Use suas credenciais do Supabase (não as do admin do site).

### 1.3 Ir para Table Editor

**Caminho:** Menu lateral esquerdo → **"Table Editor"**

### 1.4 Verificar Tabela usuarios

- Na lista de tabelas à esquerda, clique em **"usuarios"**
- **PERGUNTA:** Quantos registros aparecem na tabela?
  - **Se 0 registros:** Continue para o PASSO 2
  - **Se 1+ registros:** Pule para o PASSO 3 (verificar dados)

---

## 🎯 PASSO 2: CRIAR ADMIN (SE NÃO EXISTIR)

### 2.1 Clicar em Insert Row

**Localização:** Canto superior direito da tabela  
**Botão:** **"Insert row"** (ícone +)

### 2.2 Preencher Campos UM POR UM

**⚠️ COPIE E COLE EXATAMENTE:**

#### Campo: id
- **Deixar VAZIO** (será gerado automaticamente)

#### Campo: nome
```
Admin Site Ubatuba
```

#### Campo: email
```
admin@siteubatuba.com.br
```

#### Campo: senha
```
$2a$10$Inq376YJd3BpmjzddL6pqOD6FL8OKkxSN0Tl8R9F0l9gX5vqgLE6O
```
**⚠️ ATENÇÃO:** 
- Comece com `$2a$10$`
- NÃO digite `admin123`
- COLE o hash completo

#### Campo: role
```
admin
```

#### Campo: ativo
- **Marcar:** `true` (checkbox marcado ou dropdown "true")

#### Campos created_at e updated_at
- **Deixar VAZIOS** (serão preenchidos automaticamente)

### 2.3 Salvar

**Botão:** **"Save"** (verde, canto inferior direito)

### 2.4 Verificar Resultado

**DEVE APARECER:**
- ✅ Mensagem: "Successfully created row" ou "Row inserted successfully"
- ✅ Uma linha na tabela com os dados inseridos
- ✅ ID gerado automaticamente (ex: 1, 2, 3...)

**SE DEU ERRO:**
- ❌ Aparecer mensagem de erro vermelha
- ❌ Linha não aparecer na tabela
- → **ME AVISE qual erro apareceu!**

---

## 🎯 PASSO 3: VERIFICAR DADOS (SE ADMIN EXISTE)

### 3.1 Conferir Linha na Tabela

**Na tabela `usuarios`, deve ter:**

| id | nome | email | senha | role | ativo |
|----|------|-------|-------|------|-------|
| 1  | Admin Site Ubatuba | admin@siteubatuba.com.br | $2a$10$... | admin | true |

### 3.2 Verificar Email

**DEVE SER EXATAMENTE:**
```
admin@siteubatuba.com.br
```

**SE ESTIVER DIFERENTE:**
- Clique no ícone de editar (lápis) na linha
- Altere o email
- Salve

### 3.3 Verificar Senha

**DEVE COMEÇAR COM:**
```
$2a$10$
```

**SE ESTIVER DIFERENTE:**
- Clique no ícone de editar (lápis) na linha
- Cole a senha: `$2a$10$Inq376YJd3BpmjzddL6pqOD6FL8OKkxSN0Tl8R9F0l9gX5vqgLE6O`
- Salve

---

## 🎯 PASSO 4: TESTAR NO SITE

### 4.1 Voltar para o Site

**O site deve estar aberto no navegador**

**Se não estiver aberto:**
- Acesse: `file:///E:/Arquivos-setembro-2025/code_sandbox_light_9404f417_1759205165/index.html`

### 4.2 Ir para Login

**Opções:**
- **Desktop:** Clique "🔒 LOGIN" (menu topo)
- **Mobile:** Clique "☰" → "ÁREA ADMIN"
- **Alternativa:** Role até rodapé → "🔒 Admin"

### 4.3 Verificar Credenciais

**DEVEM APARECER PRÉ-PREENCHIDAS:**
- **Email:** `admin@siteubatuba.com.br` ✅
- **Senha:** `admin123` ✅

**SE ESTIVEREM DIFERENTES:**
- Digite manualmente
- **Email:** `admin@siteubatuba.com.br`
- **Senha:** `admin123`

### 4.4 Fazer Login

**Clique:** "Entrar no Painel"

**RESULTADO ESPERADO:**
1. Botão fica "Entrando..." (loading)
2. Muda para "Login realizado!" (verde)
3. Redireciona para dashboard
4. **✅ PAINEL ADMIN CARREGA!**

**SE DER ERRO:**
- **Me avise qual erro aparece no console**
- Pressione F12 → Console → Procure erros em vermelho

---

## 🎯 PASSO 5: VERIFICAÇÃO FINAL

### 5.1 Dashboard Carregou?

**DEVE APARECER:**
- Menu lateral com opções
- Dashboard com estatísticas
- Header com "Ubatuba Reage"
- Botão de logout

### 5.2 Testar Funcionalidades

**Clique em:** Menu → "Notícias"
- Deve abrir página de gerenciamento
- Deve ter botão "+ Nova Notícia"

### 5.3 Confirmar Sucesso

**SE TUDO FUNCIONOU:**
- ✅ Login realizado com sucesso
- ✅ Dashboard carregou
- ✅ Menus funcionando
- **🎉 PAINEL 100% FUNCIONAL!**

---

## 🔍 TROUBLESHOOTING

### Problema: "Não consigo encontrar Table Editor"

**Solução:**
1. Verifique se está logado no Supabase
2. URL deve ser: https://zrwxxnyygtesucsumzpg.supabase.co
3. Menu lateral → Ícone de tabela 📊

### Problema: "Tabela usuarios não aparece"

**Solução:**
1. Verifique se está no projeto correto
2. Role a lista de tabelas para baixo
3. Use Ctrl+F para buscar "usuarios"

### Problema: "Erro ao salvar no Supabase"

**Possíveis mensagens:**
- "Invalid input" → Verificar formato dos dados
- "Unique constraint" → Email já existe
- "Permission denied" → Problema de RLS

**Solução:**
- **Me envie a mensagem de erro exata**
- Vou ajudar a resolver

### Problema: "Login ainda não funciona"

**Verificar:**
1. Backend está rodando? (deve estar)
2. Email no Supabase = email no formulário?
3. Senha é o hash, não "admin123"?
4. Console do navegador tem erros?

**Próximos passos:**
- **Me envie print da tabela usuarios**
- **Me envie erro do console (F12)**

---

## 📝 CHECKLIST FINAL

Marque cada item conforme faz:

### Supabase:
- [ ] Acessei https://zrwxxnyygtesucsumzpg.supabase.co
- [ ] Fui em Table Editor → usuarios
- [ ] Vi 1 registro na tabela OU criei novo
- [ ] Email é: admin@siteubatuba.com.br
- [ ] Senha começa com: $2a$10$
- [ ] Role é: admin
- [ ] Ativo é: true
- [ ] Cliquei Save e vi "Successfully created"

### Site:
- [ ] Site está aberto no navegador
- [ ] Cliquei no link LOGIN
- [ ] Email aparece: admin@siteubatuba.com.br
- [ ] Senha aparece: admin123
- [ ] Cliquei "Entrar no Painel"
- [ ] Dashboard carregou com sucesso
- [ ] Posso acessar menu Notícias

---

## 🎯 RESULTADO FINAL

### ✅ Sucesso:
**Você conseguiu fazer login e usar o painel!**
→ Continue para criar sua primeira notícia

### ❌ Ainda com problema:
**Me avise exatamente onde parou:**
1. Qual passo não conseguiu fazer?
2. Que erro apareceu?
3. Print da tela (se possível)

**Vou ajudar até resolver completamente!**

---

**Última atualização:** 30/09/2025  
**Status:** Instruções detalhadas prontas  
**Tempo estimado:** 5-10 minutos  
**Dificuldade:** Fácil (seguindo o passo a passo)
