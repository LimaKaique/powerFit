window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/aulas');
    const aulas = await res.json();
    const div = document.getElementById('aulas');
    aulas.forEach(a => {
      const card = document.createElement('div');
      card.innerHTML = `
        <h3>${a.nome}</h3>
        <p>${a.instrutor}</p>
        <p>${new Date(a.horario).toLocaleString()}</p>
        <p>${a.local}</p>
        <button data-id="${a.id}">Agendar</button>
      `;
      card.querySelector('button').onclick = async () => {
        const r = await fetch('/agendar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({aula_id:a.id})});
        alert(await r.text());
      };
      div.appendChild(card);
    });
  });
  