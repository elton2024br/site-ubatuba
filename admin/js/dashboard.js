// Configuração da API
const API_URL = 'http://localhost:3000/api';

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

// Carregar estatísticas
async function loadStats() {
    try {
        // Carregar notícias
        const noticiasRes = await fetchAuth(`${API_URL}/noticias`);
        const noticiasData = await noticiasRes.json();
        
        if (noticiasData.success) {
            const noticias = noticiasData.data;
            document.getElementById('total-noticias').textContent = noticias.length;
            
            const publicadas = noticias.filter(n => n.status === 'publicado').length;
            document.getElementById('noticias-publicadas').textContent = publicadas;
            
            const totalViews = noticias.reduce((sum, n) => sum + (n.views || 0), 0);
            document.getElementById('total-views').textContent = totalViews.toLocaleString('pt-BR');
            
            loadRecentNews(noticias.slice(0, 5));
        }
        
        // Carregar categorias
        const categoriasRes = await fetchAuth(`${API_URL}/categorias`);
        const categoriasData = await categoriasRes.json();
        
        if (categoriasData.success) {
            document.getElementById('total-categorias').textContent = categoriasData.data.length;
        }
        
        // Carregar newsletter
        const newsletterRes = await fetchAuth(`${API_URL}/newsletter`);
        const newsletterData = await newsletterRes.json();
        
        if (newsletterData.success) {
            const inscritos = newsletterData.data;
            document.getElementById('total-newsletter').textContent = inscritos.length;
            
            const confirmados = inscritos.filter(i => i.confirmado).length;
            document.getElementById('newsletter-confirmados').textContent = `${confirmados} confirmados`;
        }
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar notícias recentes
function loadRecentNews(noticias) {
    const container = document.getElementById('recent-news');
    
    if (noticias.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-4">
                <i class="fas fa-inbox text-2xl mb-2"></i>
                <p class="text-sm">Nenhuma notícia ainda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = noticias.map(noticia => `
        <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
            <div class="w-2 h-2 ${noticia.status === 'publicado' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full mt-2"></div>
            <div class="flex-1 min-w-0">
                <a href="noticias.html?id=${noticia.id}" class="text-sm font-medium text-gray-800 hover:text-ubatuba-blue line-clamp-1">
                    ${noticia.titulo}
                </a>
                <p class="text-xs text-gray-500 mt-1">
                    ${new Date(noticia.data_publicacao || noticia.data_criacao).toLocaleDateString('pt-BR')} • 
                    ${noticia.views || 0} views
                </p>
            </div>
        </div>
    `).join('');
}

// Toggle sidebar em mobile
document.getElementById('sidebar-toggle')?.addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
});

// Toggle profile menu
document.getElementById('profile-btn')?.addEventListener('click', function() {
    const menu = document.getElementById('profile-menu');
    menu.classList.toggle('hidden');
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(event) {
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');
    
    if (profileBtn && profileMenu && !profileBtn.contains(event.target)) {
        profileMenu.classList.add('hidden');
    }
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

// Carregar nome do usuário
window.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
    if (user.nome) {
        document.getElementById('user-name').textContent = user.nome.split(' ')[0];
    }
    
    loadStats();
});
