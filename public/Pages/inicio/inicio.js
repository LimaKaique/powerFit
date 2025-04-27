document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header').appendChild(menuToggle);
    
    const nav = document.querySelector('nav ul');
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const planos = document.querySelectorAll('.plano');
    planos.forEach(plano => {
        plano.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        plano.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });

    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const mensagem = document.getElementById('mensagem').value;
            
            if (nome && email && mensagem) {
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h3>Mensagem Enviada!</h3>
                        <p>Obrigado ${nome}, entraremos em contato em breve.</p>
                    </div>
                `;
                document.body.appendChild(modal);
                
                modal.querySelector('.close-modal').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
                
                formContato.reset();
            } else {
                alert('Por favor, preencha todos os campos!');
            }
        });
    }

    const banner = document.querySelector('.banner');
    if (banner) {
        let scrollPos = 0;
        window.addEventListener('scroll', function() {
            const newScrollPos = window.pageYOffset;
            if (newScrollPos > scrollPos) {
                banner.style.opacity = '0.9';
            } else {
                banner.style.opacity = '1';
            }
            scrollPos = newScrollPos;
        });
    }

    const currentYear = new Date().getFullYear();
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.textContent = `© ${currentYear} Academia Fit. Todos os direitos reservados.`;
    }

    const precoElements = document.querySelectorAll('.preco');
    precoElements.forEach(preco => {
        preco.addEventListener('click', function() {
            this.classList.toggle('show-annual');
            const priceValue = this.textContent.match(/\d+/)[0];
            if (this.classList.contains('show-annual')) {
                const annualPrice = Math.round(priceValue * 10 * 0.9);
                this.textContent = `R$ ${annualPrice}/ano (10% off)`;
            } else {
                this.textContent = `R$ ${priceValue}/mês`;
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.innerHTML = `
        <p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.</p>
        <button class="accept-cookies">Aceitar</button>
    `;
    
    if (!localStorage.getItem('cookiesAccepted')) {
        document.body.appendChild(cookieBanner);
    }

    const acceptCookies = document.querySelector('.accept-cookies');
    if (acceptCookies) {
        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            document.body.removeChild(cookieBanner);
        });
    }
});