document.addEventListener('DOMContentLoaded', function() {
    const menuMobile = document.querySelector('.menu-mobile');
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuMobile.addEventListener('click', function() {
        this.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                menuMobile.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    const header = document.querySelector('.cabecalho');
    
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
            }
        });
    });

    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.diferencial, .plano, .sobre-imagem, .form-container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    const contactForm = document.getElementById('supportForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const mensagem = document.getElementById('mensagem').value;
            
            if (!nome || !email || !mensagem) {
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        
        document.body.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            alertBox.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(alertBox);
            }, 300);
        }, 5000);
    }

    const counters = document.querySelectorAll('.numero');
    if (counters.length) {
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 1);
            } else {
                counter.innerText = target;
            }
            
            function updateCounter() {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCounter, 1);
                } else {
                    counter.innerText = target;
                }
            }
        });
    }

    const galleryImages = document.querySelectorAll('.gallery-img');
    if (galleryImages.length) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        document.body.appendChild(lightbox);
        
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                lightbox.classList.add('active');
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt;
                
                while (lightbox.firstChild) {
                    lightbox.removeChild(lightbox.firstChild);
                }
                
                lightbox.appendChild(img);
            });
        });
        
        lightbox.addEventListener('click', e => {
            if (e.target !== e.currentTarget) return;
            lightbox.classList.remove('active');
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                item.classList.toggle('active');
            });
        });
    }

    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 1) {
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
        }
        
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
            
            nextBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
        }
    }

    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    const planButtons = document.querySelectorAll('.plano button');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plano = this.closest('.plano').querySelector('h3').textContent;
            localStorage.setItem('planoSelecionado', plano);
        });
    });

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const videoButtons = document.querySelectorAll('.video-play');
    videoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoContainer = this.closest('.video-container');
            const video = videoContainer.querySelector('video');
            const poster = videoContainer.querySelector('.video-poster');
            
            poster.style.display = 'none';
            video.style.display = 'block';
            video.play();
            video.setAttribute('controls', 'true');
        });
    });

    const classFilterButtons = document.querySelectorAll('.class-filter');
    classFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const classItems = document.querySelectorAll('.class-item');
            
            classFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            classItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const trainers = document.querySelectorAll('.trainer');
    trainers.forEach(trainer => {
        trainer.addEventListener('mouseenter', function() {
            this.querySelector('.trainer-social').style.opacity = '1';
        });
        
        trainer.addEventListener('mouseleave', function() {
            this.querySelector('.trainer-social').style.opacity = '0';
        });
    });

    const membershipForms = document.querySelectorAll('.membership-form');
    membershipForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('Inscrição realizada com sucesso!', 'success');
            this.reset();
        });
    });

    const scheduleDays = document.querySelectorAll('.schedule-day');
    scheduleDays.forEach(day => {
        day.addEventListener('click', function() {
            scheduleDays.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            const day = this.getAttribute('data-day');
            const scheduleItems = document.querySelectorAll('.schedule-item');
            
            scheduleItems.forEach(item => {
                if (item.getAttribute('data-day') === day) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = (scrollPosition - elementPosition) * 0.3;
            element.style.transform = `translateY(${distance}px)`;
        });
    });

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogItems = document.querySelectorAll('.blog-item');
            
            blogItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    const cookieBanner = document.querySelector('.cookie-banner');
    if (cookieBanner) {
        const acceptCookies = document.querySelector('.accept-cookies');
        
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'block';
        }
        
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        lazyObserver.observe(img);
    });

    const scrollSpyLinks = document.querySelectorAll('.scroll-spy-link');
    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.scroll-spy-link[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.scroll-spy-section').forEach(section => {
        scrollSpyObserver.observe(section);
    });

    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            this.addEventListener('mouseleave', () => {
                document.body.removeChild(tooltip);
            }, { once: true });
        });
    });

    const priceSwitcher = document.querySelector('.price-switcher');
    if (priceSwitcher) {
        priceSwitcher.addEventListener('click', function() {
            const monthlyPrices = document.querySelectorAll('.price-monthly');
            const annualPrices = document.querySelectorAll('.price-annual');
            
            if (this.classList.contains('annual')) {
                this.classList.remove('annual');
                monthlyPrices.forEach(price => price.style.display = 'block');
                annualPrices.forEach(price => price.style.display = 'none');
            } else {
                this.classList.add('annual');
                monthlyPrices.forEach(price => price.style.display = 'none');
                annualPrices.forEach(price => price.style.display = 'block');
            }
        });
    }

    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = value;
    });

    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(element => {
        const endDate = new Date(element.getAttribute('data-date')).getTime();
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            element.innerHTML = `
                <span>${days}d</span>
                <span>${hours}h</span>
                <span>${minutes}m</span>
                <span>${seconds}s</span>
            `;
            
            if (distance < 0) {
                clearInterval(timer);
                element.innerHTML = 'EXPIRED';
            }
        }, 1000);
    });
});