// Configuração da API
const API_URL = 'http://localhost:3000/api';

let inscritos = [];

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

// Carregar inscritos
async function loadInscritos() {
    try {
        const response = await fetchAuth(`${API_URL}/newsletter`);
        const data = await response.json();
        
        if (data.success) {
            inscritos = data.data;
            updateStats(inscritos);
            renderInscritos(inscritos);
        }
    } catch (error) {
        console.error('Erro ao carregar inscritos:', error);
        const tbody = document.getElementById('newsletter-table-body');
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-8 text-center text-red-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Erro ao carregar inscritos. Verifique se o backend está rodando.</p>
                </td>
            </tr>
        `;
    }
}

// Atualizar estatísticas
function updateStats(inscritosData) {
    document.getElementById('total-inscritos').textContent = inscritosData.length;
    
    const confirmados = inscritosData.filter(i => i.confirmado).length;
    document.getElementById('total-confirmados').textContent = confirmados;
    
    const pendentes = inscritosData.filter(i => !i.confirmado).length;
    document.getElementById('total-pendentes').textContent = pendentes;
}

// Renderizar inscritos
function renderInscritos(inscritosToRender) {
    const tbody = document.getElementById('newsletter-table-body');
    
    if (inscritosToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-3xl mb-3"></i>
                    <p>Nenhum inscrito encontrado</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = inscritosToRender.map(inscrito => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <i class="fas fa-envelope text-gray-400 mr-3"></i>
                    <span class="text-sm font-medium text-gray-900">${inscrito.email}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                ${new Date(inscrito.data_inscricao).toLocaleDateString('pt-BR')}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    inscrito.confirmado 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }">
                    <i class="fas ${inscrito.confirmado ? 'fa-check-circle' : 'fa-clock'} mr-1"></i>
                    ${inscrito.confirmado ? 'Confirmado' : 'Pendente'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                ${!inscrito.confirmado ? `
                    <button onclick="confirmarInscrito(${inscrito.id})" class="text-green-600 hover:text-green-800 mr-3" title="Confirmar">
                        <i class="fas fa-check-circle"></i>
                    </button>
                ` : ''}
                <button onclick="deleteInscrito(${inscrito.id})" class="text-red-600 hover:text-red-800" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filtrar inscritos
function filterInscritos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const status = document.getElementById('filter-status').value;
    
    let filtered = inscritos;
    
    if (searchTerm) {
        filtered = filtered.filter(i => i.email.toLowerCase().includes(searchTerm));
    }
    
    if (status === 'confirmado') {
        filtered = filtered.filter(i => i.confirmado);
    } else if (status === 'pendente') {
        filtered = filtered.filter(i => !i.confirmado);
    }
    
    renderInscritos(filtered);
}

// Confirmar inscrito
async function confirmarInscrito(id) {
    try {
        const response = await fetchAuth(`${API_URL}/newsletter/${id}/confirmar`, {
            method: 'PATCH'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Inscrição confirmada com sucesso!');
            loadInscritos();
        } else {
            alert('Erro ao confirmar inscrição: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao confirmar inscrito:', error);
        alert('Erro ao confirmar inscrito');
    }
}

// Excluir inscrito
async function deleteInscrito(id) {
    const inscrito = inscritos.find(i => i.id === id);
    if (!inscrito) return;
    
    if (!confirm(`Deseja realmente excluir o inscrito "${inscrito.email}"?`)) {
        return;
    }
    
    try {
        const response = await fetchAuth(`${API_URL}/newsletter/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Inscrito removido com sucesso!');
            loadInscritos();
        } else {
            alert('Erro ao excluir inscrito: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao excluir inscrito:', error);
        alert('Erro ao excluir inscrito');
    }
}

// Exportar CSV
function exportCSV() {
    const csv = ['Email,Status,Data de Inscrição'];
    
    inscritos.forEach(inscrito => {
        csv.push([
            inscrito.email,
            inscrito.confirmado ? 'Confirmado' : 'Pendente',
            new Date(inscrito.data_inscricao).toLocaleDateString('pt-BR')
        ].join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Event listeners
document.getElementById('search-input')?.addEventListener('input', filterInscritos);
document.getElementById('filter-status')?.addEventListener('change', filterInscritos);
document.getElementById('export-btn')?.addEventListener('click', exportCSV);

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
    
    loadInscritos();
});

// Expor funções
window.confirmarInscrito = confirmarInscrito;
window.deleteInscrito = deleteInscrito;
