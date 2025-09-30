# 📰 COMO CRIAR NOTÍCIAS NO SITE

**Guia Completo Passo a Passo**

---

## 🎯 VISÃO GERAL

Você pode criar notícias de **duas formas**:

1. **🌐 Online** - Via painel admin no site hospedado (Vercel)
2. **💻 Local** - Via painel admin rodando localmente

---

## 📋 PRÉ-REQUISITOS

### ⚠️ IMPORTANTE: Configure primeiro as variáveis de ambiente!

Antes de criar notícias online, você precisa configurar o Supabase na Vercel:

**Status atual:** ❌ Variáveis não configuradas (detectado nos testes)

**📝 Siga o guia:** `DIAGNOSTICO_DEPLOY.md` (Seção "SOLUÇÃO")

**Link direto:** https://vercel.com/elton2024brs-projects/site-ubatuba/settings/environment-variables

---

## 🌐 OPÇÃO 1: CRIAR NOTÍCIAS ONLINE (Recomendado)

### Passo 1: Acesse o Painel Admin

**URL:** https://site-ubatuba.vercel.app/admin/login.html

*(Substitua pelo domínio real quando estiver configurado)*

### Passo 2: Faça Login

**Credenciais padrão:**
```
Email: admin@siteubatuba.com.br
Senha: admin123
```

⚠️ **IMPORTANTE:** Altere essas credenciais após o primeiro acesso!

### Passo 3: Navegue até Notícias

- No menu lateral, clique em **"Notícias"** 📰
- Você verá a lista de todas as notícias

### Passo 4: Clique em "Nova Notícia"

- Botão azul no canto superior direito: **"+ Nova Notícia"**
- Um formulário abrirá em modal

### Passo 5: Preencha o Formulário

#### 📝 Campos obrigatórios:

**1. Título** (máx. 200 caracteres)
```
Exemplo: "Nova atração turística inaugurada em Ubatuba"
```

**2. Subtítulo** (máx. 500 caracteres)
```
Exemplo: "Mirante do Morro oferece vista panorâmica da cidade e atrai visitantes"
```

**3. Conteúdo** (HTML)
```html
<p>O novo <strong>Mirante do Morro</strong> foi inaugurado hoje...</p>
<p>A atração fica localizada na Praia do Tenório...</p>
<ul>
  <li>Horário: 8h às 18h</li>
  <li>Entrada gratuita</li>
</ul>
```

💡 **Dica:** Use HTML para formatação rica (negrito, listas, links, etc)

**4. Categoria**
```
Selecione no dropdown: Turismo, Economia, Eventos, etc.
```

**5. Imagem de Destaque**
```
Clique em "Escolher arquivo" e selecione uma imagem:
- Formatos: JPG, PNG, GIF, WebP
- Tamanho máximo: 5MB
- Dimensão recomendada: 1200x675px (16:9)
```

**6. Status**
```
○ Rascunho  - Não aparece no site (pode editar depois)
● Publicado - Aparece imediatamente no site
```

### Passo 6: Salvar

- Clique no botão **"Salvar"** (verde)
- Aguarde a confirmação: **"Notícia criada com sucesso!"**
- A notícia aparecerá na lista

### Passo 7: Verificar no Site

- Clique no botão **"Ver Site"** no header
- Ou acesse: https://site-ubatuba.vercel.app
- A notícia estará na página inicial! 🎉

---

## 💻 OPÇÃO 2: CRIAR NOTÍCIAS LOCALMENTE

### Passo 1: Iniciar o Backend

```powershell
cd backend
npm start
```

✅ **Servidor rodando em:** http://localhost:3000

### Passo 2: Abrir o Painel Admin

```powershell
start admin\login.html
```

Ou abra manualmente:
```
E:\Arquivos-setembro-2025\code_sandbox_light_9404f417_1759205165\admin\login.html
```

### Passo 3: Fazer Login

```
Email: admin@siteubatuba.com.br
Senha: admin123
```

### Passo 4 a 7: Igual à opção online acima! ✅

---

## 🎨 DICAS DE FORMATAÇÃO

### HTML Básico para Conteúdo

```html
<!-- Parágrafo -->
<p>Seu texto aqui...</p>

<!-- Negrito -->
<strong>texto em negrito</strong>

<!-- Itálico -->
<em>texto em itálico</em>

<!-- Link -->
<a href="https://exemplo.com">clique aqui</a>

<!-- Lista -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Lista numerada -->
<ol>
  <li>Primeiro</li>
  <li>Segundo</li>
</ol>

<!-- Subtítulo -->
<h3>Subtítulo da Seção</h3>

<!-- Citação -->
<blockquote>
  "Texto da citação"
</blockquote>

<!-- Imagem no conteúdo -->
<img src="URL_DA_IMAGEM" alt="descrição">
```

### 📷 Upload de Imagens

**Tamanhos recomendados:**
- **Destaque:** 1200x675px (proporção 16:9)
- **Conteúdo:** 800x450px
- **Thumbnail:** 400x225px

**Otimização:**
- Comprima antes de subir (use TinyPNG.com)
- Prefira JPG para fotos
- Use PNG para logos/gráficos
- WebP para melhor performance

---

## ✏️ EDITAR NOTÍCIA EXISTENTE

1. Na lista de notícias, clique no ícone **✏️ (lápis)**
2. Modifique os campos desejados
3. Clique em **"Salvar"**
4. Mudanças aparecem imediatamente no site

---

## 🗑️ EXCLUIR NOTÍCIA

1. Na lista de notícias, clique no ícone **🗑️ (lixeira)**
2. Confirme a exclusão no popup
3. Notícia removida do site e do banco de dados

⚠️ **Atenção:** Exclusão é permanente!

---

## 🔍 FILTRAR E BUSCAR NOTÍCIAS

### Busca por Título
```
Digite no campo "Buscar por título..."
Exemplo: "turismo"
```

### Filtrar por Categoria
```
Selecione no dropdown: "Todas", "Turismo", "Economia", etc.
```

### Filtrar por Status
```
Selecione: "Todos", "Publicado", "Rascunho"
```

---

## 📊 FLUXO COMPLETO DE PUBLICAÇÃO

```
1. Login no painel admin
   ↓
2. Clicar em "Notícias" no menu
   ↓
3. Clicar em "+ Nova Notícia"
   ↓
4. Preencher formulário:
   • Título
   • Subtítulo
   • Conteúdo (HTML)
   • Categoria
   • Imagem
   • Status: Publicado
   ↓
5. Clicar em "Salvar"
   ↓
6. ✅ Notícia publicada!
   ↓
7. Verificar no site público
```

---

## ❓ PROBLEMAS COMUNS

### ❌ "Erro ao salvar notícia"

**Causas possíveis:**
- Backend não está rodando (local)
- Variáveis de ambiente não configuradas (online)
- Imagem muito grande (>5MB)
- Campos obrigatórios vazios

**Solução:**
1. Verifique se o backend está ativo
2. Confirme credenciais do Supabase
3. Reduza tamanho da imagem
4. Preencha todos os campos obrigatórios

### ❌ "Erro ao fazer upload da imagem"

**Causas:**
- Formato não suportado
- Tamanho acima de 5MB
- Diretório `backend/public/uploads` não existe

**Solução:**
1. Use JPG, PNG, GIF ou WebP
2. Comprima a imagem
3. Crie o diretório:
```powershell
mkdir backend\public\uploads
```

### ❌ "Token inválido"

**Solução:**
1. Faça logout
2. Faça login novamente
3. Token expira após 7 dias

### ❌ "Notícia não aparece no site"

**Causas:**
- Status está como "Rascunho"
- Cache do navegador

**Solução:**
1. Edite a notícia e mude para "Publicado"
2. Limpe cache: Ctrl+F5

---

## 🎯 CHECKLIST RÁPIDO

Antes de criar sua primeira notícia:

- [ ] Backend rodando (local) OU variáveis configuradas (online)
- [ ] Login feito com sucesso
- [ ] Categorias criadas (mínimo 1)
- [ ] Imagem preparada (<5MB, 1200x675px)
- [ ] Conteúdo redigido em HTML

Para publicar:

- [ ] Título preenchido
- [ ] Subtítulo preenchido
- [ ] Conteúdo em HTML
- [ ] Categoria selecionada
- [ ] Imagem enviada
- [ ] Status: **Publicado**
- [ ] Clicar em **Salvar**

---

## 🚀 EXEMPLO PRÁTICO

### Notícia Completa de Exemplo:

**Título:**
```
Festival de Música agita orla de Ubatuba neste final de semana
```

**Subtítulo:**
```
Evento gratuito reunirá bandas locais e atrações nacionais na Praia Grande
```

**Conteúdo:**
```html
<p>O <strong>Festival Ubatuba Music</strong> acontece neste sábado (05) e domingo (06), na orla da Praia Grande, com entrada gratuita para toda a população.</p>

<h3>Programação</h3>
<ul>
  <li><strong>Sábado 19h:</strong> Banda Local XYZ</li>
  <li><strong>Sábado 21h:</strong> Show Nacional ABC</li>
  <li><strong>Domingo 18h:</strong> Apresentações infantis</li>
  <li><strong>Domingo 20h:</strong> Encerramento com fogos</li>
</ul>

<p>Segundo a organização, são esperadas mais de <strong>5 mil pessoas</strong> durante os dois dias de evento.</p>

<blockquote>
"É uma oportunidade única de valorizar a cultura local e trazer entretenimento de qualidade para os moradores e turistas"
</blockquote>

<p>Mais informações: <a href="https://festivalubatuba.com.br">festivalubatuba.com.br</a></p>
```

**Categoria:** Eventos  
**Imagem:** festival-ubatuba.jpg (1200x675px, 1.2MB)  
**Status:** Publicado

---

## 📞 SUPORTE

### Para ajuda técnica:

**Documentação completa:**
- `PAINEL_ADMIN_COMPLETO.md` - Guia do painel
- `DIAGNOSTICO_DEPLOY.md` - Resolver erros de deploy
- `admin/README.md` - Documentação técnica

### Credenciais de Acesso:

**Local:**
- Email: `admin@siteubatuba.com.br`
- Senha: `admin123`

**Online (após configurar):**
- Email: `admin@siteubatuba.com.br`
- Senha: `admin123`

⚠️ **Altere após primeiro acesso!**

---

## ✅ PRÓXIMOS PASSOS

1. **Configure as variáveis de ambiente** (se ainda não fez)
   → Veja: `DIAGNOSTICO_DEPLOY.md`

2. **Faça login no painel**
   → https://site-ubatuba.vercel.app/admin/login.html

3. **Crie sua primeira notícia!** 🎉

---

**Última atualização:** 30/09/2025  
**Dúvidas?** Consulte `PAINEL_ADMIN_COMPLETO.md` para mais detalhes!
