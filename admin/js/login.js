// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Toggle password visibility
document.getElementById('toggle-password')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    
    // Disable button and show loading
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Entrando...';
    errorMessage.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Salvar token
            localStorage.setItem('admin_token', data.data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.data.user));
            
            if (remember) {
                localStorage.setItem('remember_me', 'true');
            }
            
            // Mostrar sucesso
            loginBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Login realizado!';
            loginBtn.classList.remove('from-ubatuba-blue', 'to-blue-600');
            loginBtn.classList.add('from-green-500', 'to-green-600');
            
            // Redirecionar para o dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            throw new Error(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        
        // Mostrar erro
        document.getElementById('error-text').textContent = error.message || 'Email ou senha incorretos';
        errorMessage.classList.remove('hidden');
        
        // Restaurar botão
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Entrar no Painel';
    }
});

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('admin_token');
    if (token) {
        // Verificar se o token ainda é válido
        fetch(`${API_URL}/auth/perfil`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'dashboard.html';
            }
        })
        .catch(() => {
            // Token inválido, limpar
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
        });
    }
});
