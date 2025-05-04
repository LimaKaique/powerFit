document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (navList.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            const modal = document.createElement('div');
            modal.className = 'form-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Mensagem Enviada!</h3>
                    <p>Obrigado ${formValues.name}, sua mensagem foi recebida com sucesso.</p>
                    <button class="close-modal">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.close-modal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            this.reset();
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            localStorage.setItem('newsletterEmail', emailInput.value);
            
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = 'Inscrição realizada com sucesso!';
            this.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
            
            this.reset();
        });
    }

    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.textContent = `© ${currentYear} PowerFit Academia. Todos os direitos reservados.`;
    }

    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-3px)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0)';
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

    if (!localStorage.getItem('cookieConsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.</p>
            <button class="accept-cookies">Aceitar</button>
        `;
        document.body.appendChild(cookieBanner);
        
        const acceptButton = cookieBanner.querySelector('.accept-cookies');
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }
    
});