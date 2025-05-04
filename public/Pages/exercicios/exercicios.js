
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