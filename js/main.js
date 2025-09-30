// Intercept Brasil Clone - Main JavaScript
// Funcionalidades interativas para o site

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    initializeMobileMenu();
    
    // Search Functionality
    initializeSearch();
    
    // Newsletter Subscription
    initializeNewsletter();
    
    // Smooth Scrolling
    initializeSmoothScrolling();
    
    // Article Interactions
    initializeArticleInteractions();
    
    // Lazy Loading for better performance
    initializeLazyLoading();
    
    // Reading Progress Indicator
    initializeReadingProgress();
    
    // Carregar notícias da API (se estiver na página inicial)
    loadNoticiasFromAPI();
});

/**
 * Mobile Menu Toggle Functionality
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const body = document.body;

    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.add('open');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });

        // Close mobile menu
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.remove('open');
            body.style.overflow = ''; // Restore scrolling
        });

        // Close menu when clicking on menu links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('open');
                body.style.overflow = '';
            }
        });
    }
}

/**
 * Search Functionality
 */
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Buscar"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
        
        // Add search icon click functionality
        const searchIcon = input.parentElement?.querySelector('.fas.fa-search');
        if (searchIcon) {
            searchIcon.addEventListener('click', function() {
                performSearch(input.value);
            });
        }
    });
}

async function performSearch(query) {
    if (query.trim() === '') {
        showNotification('Digite algo para buscar', 'warning');
        return;
    }
    
    showNotification(`Buscando por: "${query}"...`, 'info');
    
    try {
        // Busca REAL na API
        const response = await fetch(`http://localhost:3000/api/noticias?busca=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.data.noticias.length > 0) {
            showNotification(`${data.data.noticias.length} resultado(s) encontrado(s)!`, 'success');
            
            // Você pode implementar exibição dos resultados aqui
            console.log('Resultados da busca:', data.data.noticias);
            
            // Exemplo: redirecionar para primeira notícia encontrada
            // window.location.href = `artigo.html?slug=${data.data.noticias[0].slug}`;
        } else if (data.success && data.data.noticias.length === 0) {
            showNotification('Nenhum resultado encontrado', 'warning');
        } else {
            showNotification('Erro ao buscar', 'error');
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        showNotification('Erro ao conectar com o servidor. Verifique se o backend está rodando.', 'error');
    }
}

/**
 * Newsletter Subscription
 */
function initializeNewsletter() {
    const newsletterForm = document.querySelector('section:has(input[type="email"])');
    const emailInput = document.querySelector('input[type="email"]');
    // Find the subscribe button by text content
    const buttons = document.querySelectorAll('button');
    let subscribeBtn = null;
    buttons.forEach(btn => {
        if (btn.textContent.includes('ASSINAR')) {
            subscribeBtn = btn;
        }
    });
    
    // Fallback to class-based search
    if (!subscribeBtn) {
        subscribeBtn = document.querySelector('button[class*="intercept-green"]');
    }
    
    if (subscribeBtn && emailInput) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            subscribeToNewsletter(emailInput.value);
        });
        
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                subscribeToNewsletter(this.value);
            }
        });
    }
}

async function subscribeToNewsletter(email) {
    if (!validateEmail(email)) {
        showNotification('Digite um e-mail válido', 'error');
        return;
    }
    
    showNotification('Processando inscrição...', 'info');
    
    try {
        // Inscrição REAL na API
        const response = await fetch('http://localhost:3000/api/newsletter/inscrever', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message || 'Inscrição realizada com sucesso!', 'success');
            document.querySelector('input[type="email"]').value = '';
        } else {
            showNotification(data.message || 'Erro ao inscrever', 'error');
        }
    } catch (error) {
        console.error('Erro na inscrição:', error);
        showNotification('Erro ao conectar com o servidor. Verifique se o backend está rodando.', 'error');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Smooth Scrolling for Internal Links
 */
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Article Interaction Features
 */
function initializeArticleInteractions() {
    const articles = document.querySelectorAll('article');
    
    articles.forEach((article, index) => {
        // Add click analytics (simulation)
        article.addEventListener('click', function() {
            trackArticleClick(index + 1);
        });
        
        // Add reading time estimation
        addReadingTimeEstimation(article);
        
        // Add social sharing buttons
        addSocialSharing(article);
    });
}

function trackArticleClick(articleId) {
    // Simulate analytics tracking
    console.log(`Article ${articleId} clicked`);
    
    // In a real implementation, this would send data to analytics service
    // Example: gtag('event', 'click', { article_id: articleId });
}

function addReadingTimeEstimation(article) {
    const text = article.textContent || '';
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Check if reading time already exists
    const existingElements = article.querySelectorAll('.text-xs');
    let readingTimeElement = null;
    existingElements.forEach(el => {
        if (el.textContent.includes('min de leitura')) {
            readingTimeElement = el;
        }
    });
    if (!readingTimeElement && wordCount > 50) {
        const timeContainer = article.querySelector('.text-xs.text-gray-400');
        if (timeContainer) {
            const readingSpan = document.createElement('span');
            readingSpan.textContent = `${readingTime} min de leitura`;
            timeContainer.appendChild(readingSpan);
        }
    }
}

function addSocialSharing(article) {
    const title = article.querySelector('h2, h3')?.textContent || 'Artigo interessante';
    const url = window.location.href;
    
    // Add sharing functionality on right-click or long press
    article.addEventListener('contextmenu', function(e) {
        if (window.navigator.share) {
            e.preventDefault();
            navigator.share({
                title: title,
                url: url
            }).catch(console.error);
        }
    });
}

/**
 * Lazy Loading Implementation
 */
function initializeLazyLoading() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Lazy load article content
    const articles = document.querySelectorAll('article[data-lazy]');
    if (articles.length > 0) {
        const articleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadArticleContent(entry.target);
                }
            });
        }, { rootMargin: '50px' });
        
        articles.forEach(article => articleObserver.observe(article));
    }
}

function loadArticleContent(article) {
    // Simulate loading additional article content
    const placeholder = article.querySelector('.content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = '<p class="text-gray-300">Conteúdo carregado dinamicamente...</p>';
    }
}

/**
 * Reading Progress Indicator
 */
function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-intercept-green z-50 transition-all duration-300';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set notification style based on type
    const styles = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-black',
        info: 'bg-blue-600 text-white'
    };
    
    notification.className += ` ${styles[type] || styles.info}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>${message}</span>
            <button class="ml-2 text-current opacity-70 hover:opacity-100" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Keyboard Navigation Enhancement
 */
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Buscar"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

/**
 * Theme and Accessibility Enhancements
 */
function initializeAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-intercept-green text-black px-4 py-2 rounded z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
    
    // Enhance focus indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Initialize accessibility features
initializeAccessibility();

/**
 * Performance Monitoring
 */
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // In a real app, you'd send this to analytics
            if (loadTime > 3000) {
                console.warn('Page load time is above 3 seconds');
            }
        }
    });
    
    // Monitor scroll performance
    let scrolling = false;
    window.addEventListener('scroll', function() {
        if (!scrolling) {
            requestAnimationFrame(function() {
                // Perform scroll-related operations here
                scrolling = false;
            });
            scrolling = true;
        }
    });
}

initializePerformanceMonitoring();

/**
 * Carregar Notícias da API
 */
async function loadNoticiasFromAPI() {
    try {
        // Verificar se há um elemento para exibir as notícias
        const noticiasContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        
        if (!noticiasContainer) {
            console.log('Container de notícias não encontrado');
            return;
        }

        const response = await fetch('http://localhost:3000/api/noticias?limit=6');
        const data = await response.json();
        
        if (data.success && data.data.noticias.length > 0) {
            console.log('✅ Notícias carregadas da API:', data.data.noticias.length);
            
            // Você pode substituir o conteúdo estático pelas notícias da API aqui
            // Exemplo de como atualizar o primeiro artigo:
            // updateArticleCards(data.data.noticias);
        }
    } catch (error) {
        console.log('ℹ️ Usando notícias estáticas (backend não está rodando ou ocorreu um erro)');
        console.error(error);
    }
}

/**
 * Função auxiliar para formatar data
 */
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
        return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
        return 'ontem';
    } else {
        return `há ${diffDays} dias`;
    }
}