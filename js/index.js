class LaVueMarket {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        this.setupRouting();
        this.setupNavigation();
        this.setupAnimations();
        this.loadStockData();
        this.setupForms();
        this.setupMobileMenu();
        this.initLucideIcons();
    }

    initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupRouting() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        this.handleRouteChange();
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || 'home';
        const [page, id] = hash.split('/');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        const targetPage = document.getElementById(page);
        const targetNavLink = document.querySelector(`[href="#${page}"]`);

        if (targetPage) {
            targetPage.classList.add('active');
            if (targetNavLink) {
                targetNavLink.classList.add('active');
            }
        }

        if (page === 'article' && id) {
            this.loadArticle(id);
        }

        this.updatePageTitle(page);
        this.scrollToTop();
    }

    updatePageTitle(page) {
        const titles = {
            'home': 'LaVue Market - Professional Financial Portal',
            'articles': 'Financial Articles & Analysis - LaVue Market',
            'about': 'About Us - LaVue Market',
            'contact': 'Contact Us - LaVue Market',
            'privacy': 'Privacy Policy - LaVue Market',
            'terms': 'Terms of Service - LaVue Market',
            'article': 'Article - LaVue Market'
        };
        document.title = titles[page] || titles['home'];
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link, .article-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    window.location.hash = href;
                }
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.location.hash = href;
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-active');
            });
        }
    }

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.article-card, .stock-card, .about-section').forEach(el => {
            observer.observe(el);
        });

        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        let ticking = false;
        
        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            
            if (scrolled > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
            }
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    async loadStockData() {
        const stocksGrid = document.getElementById('stocksGrid');
        
        const mockStocks = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, change: '+2.15', changePercent: '+1.19%', isPositive: true },
            { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.75, change: '+8.32', changePercent: '+2.04%', isPositive: true },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: '-1.23', changePercent: '-0.80%', isPositive: false },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: '+3.45', changePercent: '+2.56%', isPositive: true },
            { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.73, change: '+12.15', changePercent: '+5.13%', isPositive: true },
            { symbol: 'META', name: 'Meta Platforms', price: 484.20, change: '+7.89', changePercent: '+1.66%', isPositive: true },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: '+15.67', changePercent: '+1.82%', isPositive: true },
            { symbol: 'JPM', name: 'JPMorgan Chase', price: 178.45, change: '-0.87', changePercent: '-0.49%', isPositive: false },
            { symbol: 'V', name: 'Visa Inc.', price: 267.89, change: '+1.23', changePercent: '+0.46%', isPositive: true }
        ];

        try {
            stocksGrid.innerHTML = '';
            
            mockStocks.forEach((stock, index) => {
                setTimeout(() => {
                    const stockCard = this.createStockCard(stock);
                    stocksGrid.appendChild(stockCard);
                }, index * 100);
            });

            setInterval(() => this.updateStockPrices(mockStocks), 30000);
            
        } catch (error) {
            stocksGrid.innerHTML = '<div class="error">Unable to load market data at this time.</div>';
        }
    }

    createStockCard(stock) {
        const card = document.createElement('div');
        card.className = 'stock-card';
        
        const trendIcon = stock.isPositive ? 'trending-up' : 'trending-down';
        
        card.innerHTML = `
            <div class="stock-header">
                <div>
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-price">$${stock.price}</div>
            </div>
            <div class="stock-change ${stock.isPositive ? 'positive' : 'negative'}">
                <i data-lucide="${trendIcon}"></i>
                <span>${stock.change} (${stock.changePercent})</span>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            setTimeout(() => lucide.createIcons(), 0);
        }
        
        return card;
    }

    updateStockPrices(stocks) {
        stocks.forEach((stock, index) => {
            const change = (Math.random() - 0.5) * 2;
            const newPrice = Math.max(0.01, stock.price + change);
            const priceChange = newPrice - stock.price;
            const percentChange = ((priceChange / stock.price) * 100);
            
            stock.price = parseFloat(newPrice.toFixed(2));
            stock.change = priceChange >= 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2);
            stock.changePercent = percentChange >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`;
            stock.isPositive = priceChange >= 0;

            const stockCard = document.querySelectorAll('.stock-card')[index];
            if (stockCard) {
                this.updateStockCardDisplay(stockCard, stock);
            }
        });
    }

    updateStockCardDisplay(card, stock) {
        const priceElement = card.querySelector('.stock-price');
        const changeElement = card.querySelector('.stock-change');
        const icon = changeElement.querySelector('i');
        
        priceElement.textContent = `$${stock.price}`;
        changeElement.className = `stock-change ${stock.isPositive ? 'positive' : 'negative'}`;
        changeElement.querySelector('span').textContent = `${stock.change} (${stock.changePercent})`;
        
        const newIcon = stock.isPositive ? 'trending-up' : 'trending-down';
        icon.setAttribute('data-lucide', newIcon);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'slideInUp 0.3s ease';
    }

    setupForms() {
        const contactForm = document.querySelector('.contact-form');
        const newsletterForm = document.querySelector('.newsletter-form');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(contactForm);
            });
        }

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(newsletterForm);
            });
        }
    }

    handleContactSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const button = form.querySelector('.submit-button');
        const originalText = button.textContent;
        
        button.textContent = 'Sending...';
        button.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    handleNewsletterSubmission(form) {
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        setTimeout(() => {
            alert('Successfully subscribed to our newsletter!');
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    loadArticle(id) {
        const articles = {
            '1': {
                title: 'Federal Reserve Policy Changes: Comprehensive Market Impact Analysis',
                category: 'Market Analysis',
                date: 'March 15, 2025',
                author: 'Sarah Johnson',
                content: 'Full article content would be loaded here...'
            }
        };

        const article = articles[id];
        if (article) {
            document.querySelector('.article-title-full').textContent = article.title;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LaVueMarket();
});

document.addEventListener('DOMContentLoaded', function() {
    const cta = document.querySelector('.cta-button');
    if (cta) {
        cta.addEventListener('click', function() {
            window.location.hash = '#articles';
        });
    }

    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});

window.addEventListener('load', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});