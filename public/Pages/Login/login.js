document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const naAcademia = document.getElementById('naAcademia').checked;

  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, senha })
  });
if (response.ok && naAcademia) {
  await fetch('/acessos', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ tipo:'entrada' })
  });
}
  if (response.ok ) {
    //alert('Login realizado com sucesso!');
      window.location.href = '/planos';
  } else {
    alert('Email ou senha incorretos!');
  }
});
