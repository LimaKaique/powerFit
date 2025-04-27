window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/minhasAulas');
    if (!res.ok) { alert('Faça login antes'); return; }
    const aulas = await res.json();
    const div = document.getElementById('minhasAulas');
    aulas.forEach(a => {
      const card = document.createElement('div');
      card.innerHTML = `
        <h3>${a.nome}</h3>
        <p>${a.instrutor}</p>
        <p>${new Date(a.horario).toLocaleString()}</p>
        <p>Agendado em: ${new Date(a.data_agendamento).toLocaleString()}</p>
      `;
      div.appendChild(card);
    });
  });
  