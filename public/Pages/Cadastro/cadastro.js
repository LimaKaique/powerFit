document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  const response = await fetch('http://localhost:8080/cadastrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, email, usuario, senha })
  });

  if (response.ok) {
    alert('Cadastro realizado com sucesso!');
    window.location.href = '/Pages/Login/login.html';  // Redireciona para a página de login
  } else {
    alert('Erro ao cadastrar');
  }
});
