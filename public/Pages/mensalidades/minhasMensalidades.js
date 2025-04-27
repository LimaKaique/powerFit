window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/mensalidades');
    const mens = await res.json();
    const container = document.getElementById('mensalidades');
    container.innerHTML = '';
  
    mens.forEach(m => {
      const card = document.createElement('div');
      card.className = 'mensalidade-card';
  
      const venc = new Date(m.vencimento).toLocaleDateString('pt-BR');
      const pago = m.pago;
      const dataPag = m.data_pagamento
        ? new Date(m.data_pagamento).toLocaleDateString('pt-BR')
        : '—';
  
      // Aqui incluímos o botão COM data-id quando estiver pendente
      card.innerHTML = `
        <h3>${m.mes_ano}</h3>
        <p>Vencimento: ${venc}</p>
        <p>Status: <span class="${pago ? 'pago' : 'pendente'}">${pago ? 'Pago' : 'Pendente'}</span></p>
        ${pago
          ? `<p>Pago em: ${dataPag}</p>`
          : `<button class="btn-pagar" data-id="${m.id}">Pagar</button>`
        }
      `;
  
      // Se tiver botão, já conectamos o evento aqui
      const btn = card.querySelector('.btn-pagar');
      if (btn) {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;               // agora não será undefined
          console.log('Vou pagar mensalidade', id);
          const r = await fetch(`/mensalidades/${id}/pagar`, { method: 'POST' });
          const text = await r.text();
          if (r.ok) {
            alert(text);
            window.location.reload();
          } else {
            alert(`Erro ${r.status}: ${text}`);
          }
        });
      }
  
      container.appendChild(card);
    });
  
    if (mens.length === 0) {
      container.innerHTML = '<p>Nenhuma mensalidade encontrada.</p>';
    }
  });
  