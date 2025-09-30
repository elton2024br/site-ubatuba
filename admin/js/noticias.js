// Configuração da API
const API_URL = 'http://localhost:3000/api';

let categorias = [];
let noticias = [];

// Verificar autenticação
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// Fazer requisição autenticada
async function fetchAuth(url, options = {}) {
    const token = checkAuth();
    if (!token) return;
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    // Não adicionar Content-Type se for FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = 'login.html';
        return;
    }
    
    return response;
}

// Carregar categorias
async function loadCategorias() {
    try {
        const response = await fetchAuth(`${API_URL}/categorias`);
        const data = await response.json();
        
        if (data.success) {
            categorias = data.data;
            
            // Preencher selects de categoria
            const categoriaSelects = ['filter-categoria', 'noticia-categoria'];
            categoriaSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select && selectId !== 'filter-categoria') {
                    select.innerHTML = '<option value="">Selecione...</option>';
                }
                
                categorias.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.nome;
                    select.appendChild(option);
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Carregar notícias
async function loadNoticias() {
    try {
        const response = await fetchAuth(`${API_URL}/noticias`);
        const data = await response.json();
        
        if (data.success) {
            noticias = data.data;
            renderNoticias(noticias);
        }
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        const tbody = document.getElementById('noticias-table-body');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-red-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Erro ao carregar notícias. Verifique se o backend está rodando.</p>
                </td>
            </tr>
        `;
    }
}

// Renderizar notícias na tabela
function renderNoticias(noticiasToRender) {
    const tbody = document.getElementById('noticias-table-body');
    
    if (noticiasToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-3xl mb-3"></i>
                    <p>Nenhuma notícia encontrada</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = noticiasToRender.map(noticia => {
        const categoria = categorias.find(c => c.id === noticia.categoria_id);
        const statusColors = {
            'publicado': 'bg-green-100 text-green-800',
            'rascunho': 'bg-yellow-100 text-yellow-800',
            'arquivado': 'bg-gray-100 text-gray-800'
        };
        
        return `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                    <div class="flex items-start space-x-3">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 line-clamp-1">${noticia.titulo}</p>
                            <p class="text-xs text-gray-500 mt-1 line-clamp-1">${noticia.subtitulo || ''}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style="background-color: ${categoria?.cor}22; color: ${categoria?.cor}">
                        ${categoria?.nome || 'Sem categoria'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    ${new Date(noticia.data_publicacao || noticia.data_criacao).toLocaleDateString('pt-BR')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    <i class="fas fa-eye mr-1"></i>
                    ${noticia.views || 0}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[noticia.status] || statusColors['rascunho']}">
                        ${noticia.status || 'rascunho'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="editNoticia(${noticia.id})" class="text-ubatuba-blue hover:text-ubatuba-dark mr-3" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteNoticia(${noticia.id})" class="text-red-600 hover:text-red-800" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filtrar notícias
function filterNoticias() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoriaId = document.getElementById('filter-categoria').value;
    const status = document.getElementById('filter-status').value;
    
    let filtered = noticias;
    
    if (searchTerm) {
        filtered = filtered.filter(n => 
            n.titulo.toLowerCase().includes(searchTerm) ||
            (n.subtitulo && n.subtitulo.toLowerCase().includes(searchTerm))
        );
    }
    
    if (categoriaId) {
        filtered = filtered.filter(n => n.categoria_id == categoriaId);
    }
    
    if (status) {
        filtered = filtered.filter(n => n.status === status);
    }
    
    renderNoticias(filtered);
}

// Abrir modal para nova notícia
function openNewNoticiaModal() {
    document.getElementById('modal-title').textContent = 'Nova Notícia';
    document.getElementById('noticia-form').reset();
    document.getElementById('noticia-id').value = '';
    document.getElementById('preview-imagem').classList.add('hidden');
    document.getElementById('editor-modal').classList.remove('hidden');
}

// Editar notícia
async function editNoticia(id) {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    
    document.getElementById('modal-title').textContent = 'Editar Notícia';
    document.getElementById('noticia-id').value = noticia.id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-subtitulo').value = noticia.subtitulo || '';
    document.getElementById('noticia-categoria').value = noticia.categoria_id;
    document.getElementById('noticia-autor').value = noticia.autor || '';
    document.getElementById('noticia-conteudo').value = noticia.conteudo || '';
    document.getElementById('noticia-status').value = noticia.status;
    
    if (noticia.imagem_destaque) {
        const preview = document.getElementById('preview-imagem');
        preview.querySelector('img').src = `http://localhost:3000${noticia.imagem_destaque}`;
        preview.classList.remove('hidden');
    }
    
    document.getElementById('editor-modal').classList.remove('hidden');
}

// Excluir notícia
async function deleteNoticia(id) {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    
    if (!confirm(`Deseja realmente excluir a notícia "${noticia.titulo}"?`)) {
        return;
    }
    
    try {
        const response = await fetchAuth(`${API_URL}/noticias/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Notícia excluída com sucesso!');
            loadNoticias();
        } else {
            alert('Erro ao excluir notícia: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao excluir notícia:', error);
        alert('Erro ao excluir notícia');
    }
}

// Salvar notícia
document.getElementById('noticia-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('noticia-id').value;
    const titulo = document.getElementById('noticia-titulo').value;
    const subtitulo = document.getElementById('noticia-subtitulo').value;
    const categoria_id = document.getElementById('noticia-categoria').value;
    const autor = document.getElementById('noticia-autor').value;
    const conteudo = document.getElementById('noticia-conteudo').value;
    const status = document.getElementById('noticia-status').value;
    const imagemFile = document.getElementById('noticia-imagem').files[0];
    
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
    
    try {
        let imagem_destaque = null;
        
        // Upload de imagem se houver
        if (imagemFile) {
            const formData = new FormData();
            formData.append('imagem', imagemFile);
            
            const uploadResponse = await fetchAuth(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
                headers: {} // Remover Content-Type para FormData
            });
            
            const uploadData = await uploadResponse.json();
            
            if (uploadData.success) {
                imagem_destaque = uploadData.data.url;
            }
        }
        
        // Dados da notícia
        const noticiaData = {
            titulo,
            subtitulo,
            categoria_id: parseInt(categoria_id),
            autor,
            conteudo,
            status
        };
        
        if (imagem_destaque) {
            noticiaData.imagem_destaque = imagem_destaque;
        }
        
        // Criar ou atualizar
        const url = id ? `${API_URL}/noticias/${id}` : `${API_URL}/noticias`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetchAuth(url, {
            method,
            body: JSON.stringify(noticiaData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(id ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!');
            document.getElementById('editor-modal').classList.add('hidden');
            loadNoticias();
        } else {
            alert('Erro ao salvar notícia: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao salvar notícia:', error);
        alert('Erro ao salvar notícia');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar Notícia';
    }
});

// Event listeners
document.getElementById('new-noticia-btn')?.addEventListener('click', openNewNoticiaModal);
document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('editor-modal').classList.add('hidden');
});
document.getElementById('cancel-btn')?.addEventListener('click', () => {
    document.getElementById('editor-modal').classList.add('hidden');
});

document.getElementById('search-input')?.addEventListener('input', filterNoticias);
document.getElementById('filter-categoria')?.addEventListener('change', filterNoticias);
document.getElementById('filter-status')?.addEventListener('change', filterNoticias);

// Preview de imagem
document.getElementById('noticia-imagem')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview-imagem');
            preview.querySelector('img').src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Toggle sidebar
document.getElementById('sidebar-toggle')?.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
});

// Profile menu
document.getElementById('profile-btn')?.addEventListener('click', function() {
    document.getElementById('profile-menu').classList.toggle('hidden');
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = 'login.html';
    }
});

// Inicializar
window.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
    if (user.nome) {
        document.getElementById('user-name').textContent = user.nome.split(' ')[0];
    }
    
    loadCategorias();
    loadNoticias();
});

// Expor funções globalmente
window.editNoticia = editNoticia;
window.deleteNoticia = deleteNoticia;
