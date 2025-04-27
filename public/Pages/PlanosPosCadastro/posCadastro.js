document.addEventListener('DOMContentLoaded', function () {
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    const planCards = document.querySelectorAll('.plan-card');

    planCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Formulário enviado com sucesso!');
            this.reset();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const planoId = button.getAttribute('data-plano');
  
        try {
          const res = await fetch('/assinatura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plano: planoId })
          });
  
          const text = await res.text();           // servidor responde com texto
          if (!res.ok) throw new Error(text);
  
          console.log('Resposta da assinatura:', text);
          // **agora sim** redireciona para a home (ou outra rota)
          window.location.href = '/home';
  
        } catch (err) {
          console.error('Erro no fetch:', err);
          alert(`Não foi possível assinar: ${err.message}`);
        }
      });
    });
  });
  