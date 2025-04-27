window.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/mensalidades');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const mensalidades = await res.json();
  
      const container = document.getElementById('mensalidades');
      container.innerHTML = '';
  
      mensalidades.forEach(m => {
        const card = document.createElement('div');
        card.classList.add('mensalidade-card');
  
        // Formatar datas
        const venc = new Date(m.vencimento).toLocaleDateString('pt-BR');
        const pago = m.pago;
        const dataPag = m.data_pagamento
          ? new Date(m.data_pagamento).toLocaleDateString('pt-BR')
          : '—';
  
        card.innerHTML = `
          <h3>Mês/Ano: ${m.mes_ano}</h3>
          <p><strong>Vencimento:</strong> ${venc}</p>
          <p><strong>Pago:</strong>
            <span class="status ${pago ? 'pago' : 'pendente'}">
              ${pago ? 'Sim' : 'Não'}
            </span>
          </p>
          ${pago
            ? `<p><strong>Data do Pagamento:</strong> ${dataPag}</p>`
            : ''
          }
        `;
        container.appendChild(card);
      });
  
      if (mensalidades.length === 0) {
        container.innerHTML = '<p>Nenhuma mensalidade encontrada.</p>';
      }
    } catch (err) {
      console.error('Erro ao carregar mensualidades:', err);
      document.getElementById('mensalidades').innerHTML =
        '<p>Erro ao carregar mensalidades. Tente novamente mais tarde.</p>';
    }
  });
  