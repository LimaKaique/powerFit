window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/minhasAulas');
    if (!res.ok) { alert('Faça login antes'); return; }
    const aulas = await res.json();
    const div = document.getElementById('minhasAulas');
    aulas.forEach(a => {
      const card = document.createElement('div');
      card.classList.add('aula');
      card.innerHTML = `
        <h3>${a.nome}</h3>
        <p>${a.instrutor}</p>
        <p>${new Date(a.horario).toLocaleString()}</p>
        <p>Agendado em: ${new Date(a.data_agendamento).toLocaleString()}</p>
      `;
      div.appendChild(card);
    });
  });
  
  document.getElementById('btn-sair').addEventListener('click', async () => {
    // só registra saída se realmente entrou antes
    if (localStorage.getItem('naAcademia') === 'true') {
      const r1 = await fetch('/acessos', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ tipo: 'saida' })
      });
      if (!r1.ok) {
        alert('Erro ao registrar saída');
        return;
      }
      // limpa a flag
      localStorage.removeItem('naAcademia');
    }
  
    // faz logout no servidor
    const r2 = await fetch('/logout', { method: 'POST' });
    if (r2.ok) {
      // redireciona para login
      window.location.href = '/Pages/Login/login.html';
    } else {
      alert('Erro no logout');
    }
  });
  