// Configuração da API
const API_URL = 'http://localhost:3000/api';

let categorias = [];

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
        'Content-Type': 'application/json',
        ...options.headers
    };
    
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
            renderCategorias(categorias);
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Renderizar categorias
function renderCategorias(categoriasToRender) {
    const grid = document.getElementById('categorias-grid');
    
    if (categoriasToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-12">
                <i class="fas fa-inbox text-4xl mb-3"></i>
                <p>Nenhuma categoria cadastrada</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = categoriasToRender.map(categoria => `
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition border-l-4" style="border-left-color: ${categoria.cor}">
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: ${categoria.cor}22">
                        <i class="fas fa-tag text-xl" style="color: ${categoria.cor}"></i>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editCategoria(${categoria.id})" class="text-ubatuba-blue hover:text-ubatuba-dark" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteCategoria(${categoria.id})" class="text-red-600 hover:text-red-800" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-1">${categoria.nome}</h3>
                <p class="text-sm text-gray-500">
                    <i class="fas fa-code mr-1"></i>
                    ${categoria.slug}
                </p>
            </div>
        </div>
    `).join('');
}

// Abrir modal
function openModal() {
    document.getElementById('modal-title').textContent = 'Nova Categoria';
    document.getElementById('categoria-form').reset();
    document.getElementById('categoria-id').value = '';
    document.getElementById('categoria-modal').classList.remove('hidden');
}

// Editar categoria
function editCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    document.getElementById('modal-title').textContent = 'Editar Categoria';
    document.getElementById('categoria-id').value = categoria.id;
    document.getElementById('categoria-nome').value = categoria.nome;
    document.getElementById('categoria-cor').value = categoria.cor;
    document.getElementById('categoria-modal').classList.remove('hidden');
}

// Excluir categoria
async function deleteCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    if (!confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
        return;
    }
    
    try {
        const response = await fetchAuth(`${API_URL}/categorias/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Categoria excluída com sucesso!');
            loadCategorias();
        } else {
            alert('Erro ao excluir categoria: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        alert('Erro ao excluir categoria');
    }
}

// Salvar categoria
document.getElementById('categoria-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('categoria-id').value;
    const nome = document.getElementById('categoria-nome').value;
    const cor = document.getElementById('categoria-cor').value;
    
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
    
    try {
        const categoriaData = { nome, cor };
        const url = id ? `${API_URL}/categorias/${id}` : `${API_URL}/categorias`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetchAuth(url, {
            method,
            body: JSON.stringify(categoriaData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(id ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
            document.getElementById('categoria-modal').classList.add('hidden');
            loadCategorias();
        } else {
            alert('Erro ao salvar categoria: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar';
    }
});

// Event listeners
document.getElementById('new-categoria-btn')?.addEventListener('click', openModal);
document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('categoria-modal').classList.add('hidden');
});
document.getElementById('cancel-btn')?.addEventListener('click', () => {
    document.getElementById('categoria-modal').classList.add('hidden');
});

document.getElementById('sidebar-toggle')?.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
});

document.getElementById('profile-btn')?.addEventListener('click', function() {
    document.getElementById('profile-menu').classList.toggle('hidden');
});

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
});

// Expor funções
window.editCategoria = editCategoria;
window.deleteCategoria = deleteCategoria;
