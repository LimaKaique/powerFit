const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 8080;

// Sessão
app.use(session({
  secret: 'meusegredoseguro123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2601',
  database: 'usuariosacademia'
});
db.connect(err => {
  if (err) console.error('MySQL error:', err);
  else console.log('Conectado ao MySQL');
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// — CADASTRO
app.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome||!email||!senha) return res.status(400).json({ message: 'Campos obrigatórios' });
  db.query(
    'INSERT INTO cadastro (nome,email,senha) VALUES (?,?,?)',
    [nome,email,senha],
    (err) => err
      ? res.status(500).json({ message: 'Erro ao cadastrar' })
      : res.status(200).json({ message: 'Cadastrado!' })
  );
});

// — LOGIN
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.query(
    'SELECT id FROM cadastro WHERE email=? AND senha=?',
    [email,senha],
    (err, results) => {
      if (err) return res.status(500).send('Erro');
      if (!results.length) return res.status(401).send('Credenciais inválidas');
      req.session.usuario_id = results[0].id;
      res.send('OK');
    }
  );
});

app.get('/home', (req, res) => {
  if (!req.session.usuario_id) return res.redirect('/login');
  
  // Verificar no banco de dados se ele tem assinatura ativa
  db.query(
    `SELECT * FROM assinaturas WHERE usuario_id = ? AND status = 'pago' AND proximo_vencimento >= CURDATE()`,
    [req.session.usuario_id],
    (err, results) => {
      if (err) {
        console.error('Erro ao verificar assinatura:', err);
        return res.status(500).send('Erro no servidor');
      }
      if (!results.length) {
        // Sem assinatura ativa -> manda para escolher plano
        return res.redirect('/planos');
      }
      // Tem assinatura -> pode acessar a home
      res.sendFile(path.join(__dirname,'public/Pages/Home/home.html'));
    }
  );
});


// — GET AULAS (do banco)
app.get('/aulas', (req, res) => {
  db.query('SELECT * FROM aulas', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar aulas');
    res.json(results);
  });
});

// — AGENDAR AULA
// Proteger agendamento: só quem tem assinatura “paga” e ainda válida
// — AGENDAR AULA (corrigido)
app.post('/agendar', (req, res, next) => {
  const usuario_id = req.session.usuario_id;
  if (!usuario_id) return res.status(401).send('Não logado');
  
  db.query(
    `SELECT * FROM assinaturas
     WHERE usuario_id = ? AND status = 'pago' AND proximo_vencimento >= CURDATE()`,
    [usuario_id],
    (err, subs) => {
      if (err) return res.status(500).send('Erro');
      if (!subs.length) return res.status(403).send('Plano não ativo');
      next();   // libera para rota original de /agendar
    }
  );
}, (req, res) => {
  // Aqui você trata o agendamento depois do next()
  const usuario_id = req.session.usuario_id;
  const { aula_id } = req.body;

  if (!aula_id) return res.status(400).send('ID da aula é obrigatório');

  db.query(
    `INSERT INTO agendamentos (usuario_id, aula_id, data_agendamento)
     VALUES (?,?,CURDATE())`,
    [usuario_id, aula_id],
    (err) => {
      if (err) {
        console.error('Erro ao agendar aula:', err);
        return res.status(500).send('Erro ao agendar aula');
      }
      res.send('Aula agendada com sucesso!');
    }
  );
});


// — MINHAS AULAS
app.get('/minhasAulas', (req, res) => {
  const usuario_id = req.session.usuario_id;
  if (!usuario_id) return res.status(401).send('Não logado');
  const sql = `
    SELECT a.nome, a.instrutor, a.horario, a.local, ag.data_agendamento
    FROM agendamentos ag
    JOIN aulas a ON ag.aula_id = a.id
    WHERE ag.usuario_id = ?
  `;
  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).send('Erro');
    res.json(results);
  });
});

app.post('/assinatura', (req, res) => {
  const usuario_id = req.session.usuario_id;
  const { plano } = req.body;
  if (!usuario_id) return res.status(401).send('Não logado');

  const hoje = new Date();
  const prox = new Date(hoje.getFullYear(), hoje.getMonth()+1, hoje.getDate());

  // 1) Insere a assinatura
  db.query(
    `INSERT INTO assinaturas (usuario_id, plano, proximo_vencimento)
     VALUES (?,?,?)`,
    [usuario_id, plano, prox.toISOString().slice(0,10)],
    (err) => {
      if (err) {
        console.error('Erro no INSERT assinaturas:', err);
        return res.status(500).send('Erro ao assinar plano');
      }

      // 2) Só depois de inserir a assinatura, gera as duas mensalidades
      const geraMensalidades = [];
      for (let i = 0; i < 2; i++) {
        const dt = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
        const mesAno = dt.toISOString().slice(0, 7);
        const venc = new Date(dt.getFullYear(), dt.getMonth()+1, 0);
        geraMensalidades.push([usuario_id, mesAno, venc.toISOString().slice(0,10)]);
      }
      db.query(
        'INSERT INTO mensalidades (usuario_id, mes_ano, vencimento) VALUES ?',
        [geraMensalidades],
        (err2) => {
          if (err2) {
            console.error('Erro ao gerar mensalidades:', err2);
            // aqui você pode decidir: falha na geração de mensalidades não impede assinatura
            // por isso vamos apenas logar e ainda responder sucesso de assinatura
          }
          // 3) Finalmente, UMA ÚNICA resposta ao cliente:
          res.send('Plano assinado e mensalidades iniciais criadas');
        }
      );
    }
  );
});


function garanteSemAssinatura(req, res, next) {
  const uid = req.session.usuario_id;
  if (!uid) return res.redirect('/login');

  db.query(
    `SELECT 1
       FROM assinaturas
      WHERE usuario_id = ?
        AND status = 'pago'
        AND proximo_vencimento >= CURDATE()
      LIMIT 1`,
    [uid],
    (err, rows) => {
      if (err) {
        console.error('Erro verificando assinatura:', err);
        return res.status(500).send('Erro no servidor');
      }
      if (rows.length) {
        // já tem assinatura ativa → vai pra home
        return res.redirect('/home');
      }
      // não tem assinatura → deixa ver a página de planos
      next();
    }
  );
}



// Rota para listar mensalidades do usuário
app.get('/mensalidades', (req, res) => {
  const uid = req.session.usuario_id;
  if (!uid) return res.status(401).send('Não logado');

  db.query(
    `SELECT id, mes_ano, vencimento, pago, data_pagamento
     FROM mensalidades WHERE usuario_id=? ORDER BY vencimento`,
    [uid],
    (err, rows) => {
      if (err) return res.status(500).send('Erro');

      // converte mes_ano para Date e garante 2 registros:
      const existentes = rows.map(r => ({
        id: r.id,
        mes_ano: r.mes_ano,
        vencimento: r.vencimento,
        pago: r.pago,
        data_pagamento: r.data_pagamento
      }));

      // gera “futuros” até ter pelo menos 2
      const faltam = 2 - existentes.length;
      for (let i = 0; i < faltam; i++) {
        const dt = new Date();
        // se já houver uma mensalidade, baseia no último vencimento; caso contrário hoje
        const base = existentes.length
          ? new Date(existentes[existentes.length - 1].vencimento)
          : dt;
        const next = new Date(base.getFullYear(), base.getMonth()+1, 1);
        existentes.push({
          id: null,
          mes_ano: next.toISOString().slice(0,7),
          vencimento: next.toISOString().slice(0,10),
          pago: false,
          data_pagamento: null
        });
      }

      res.json(existentes);
    }
  );
});



app.post('/acessos', (req,res) => {
  const usuario_id = req.session.usuario_id;
  const { tipo } = req.body;        // 'entrada' ou 'saida'
  db.query(
    'INSERT INTO acessos (usuario_id, tipo) VALUES (?,?)',
    [usuario_id, tipo],
    err => err ? res.status(500).send('Erro') : res.send('Ok')
  );
});

function verificaPlano(req, res, next) {
  if (!req.session.usuario_id) {
    // não está logado → login
    return res.redirect('/login');
  }
  if (req.session.assinouPlano) {
    // já assinou → home
    return res.redirect('/home');
  }
  // logado e não assinou → deixa seguir para planos
  next();
}

const cron = require('node-cron');

// roda todo dia 1 às 00:00
cron.schedule('0 0 1 * *', () => {
  const sql = `
    INSERT INTO mensalidades (usuario_id, mes_ano, vencimento)
    SELECT usuario_id,
           DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m'),
           LAST_DAY(DATE_ADD(NOW(), INTERVAL 1 MONTH))
    FROM assinaturas
    WHERE status='pago' AND proximo_vencimento >= CURDATE()
  `;
  db.query(sql, err => {
    if (err) console.error('Erro ao gerar mensalidades:', err);
    else console.log('Mensalidades do próximo mês geradas.');
  });
});

// marcar uma mensalidade como paga
app.post('/mensalidades/:id/pagar', (req, res) => {
  const usuario_id = req.session.usuario_id;
  const mensalidadeId = req.params.id;
  console.log('>> Pagamento solicitado: mensalidade id =', mensalidadeId, 'usuário =', usuario_id);

  if (!usuario_id) {
    console.log('Usuário não logado tentou pagar');
    return res.status(401).send('Não logado');
  }

  const sql = `
    UPDATE mensalidades
      SET pago = TRUE,
          data_pagamento = NOW()
    WHERE id = ? AND usuario_id = ?
  `;
  db.query(sql, [mensalidadeId, usuario_id], (err, result) => {
    if (err) {
      console.error('Erro no UPDATE mensalidades:', err);
      return res.status(500).send('Erro ao registrar pagamento');
    }
    console.log('Resultado do UPDATE:', result);
    if (result.affectedRows === 0) {
      console.log('Nenhuma linha atualizada — id não encontrado ou pertence a outro usuário');
      return res.status(404).send('Mensalidade não encontrada');
    }
    res.send('Pagamento registrado com sucesso');
  });
});

// Rota de Logout: destrói a sessão
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
      return res.status(500).send('Erro no logout');
    }
    res.send('Logout realizado');
  });
});

function garanteAssinatura(req, res, next) {
  const uid = req.session.usuario_id;
  if (!uid) return res.redirect('/login');

  db.query(
    `SELECT 1
       FROM assinaturas
      WHERE usuario_id = ?
        AND status = 'pago'
        AND proximo_vencimento >= CURDATE()
      LIMIT 1`,
    [uid],
    (err, rows) => {
      if (err) return res.status(500).send('Erro no servidor');
      if (!rows.length) return res.redirect('/planos');
      next();
    }
  );
}


// — ROTAS DE PÁGINAS
app.get('/',           (req,res)=> res.sendFile(path.join(__dirname,'public/index.html')));
app.get('/login',      (req,res)=> res.sendFile(path.join(__dirname,'public/Pages/Login/login.html')));
app.get('/agendarAula',(req,res)=> res.sendFile(path.join(__dirname,'public/Pages/AgendarAula/agendarAula.html')));
app.get('/minhasAulas',(req,res)=> res.sendFile(path.join(__dirname,'public/Pages/MinhasAulas/minhasAulas.html')));
app.get('/planos', garanteSemAssinatura, (req, res) => {
  res.sendFile(path.join(__dirname,'public/Pages/PlanosPosCadastro/posCadastro.html'));
});

app.get('/home', (req, res) => {
  if (!req.session.usuario_id) return res.redirect('/login');
  res.sendFile(path.join(__dirname,'public/Pages/Home/home.html'));
});
app.post('/agendar', garanteAssinatura, (req, res) => {
  res.sendFile(path.join(__dirname,'public/Pages/AgendarAula/agendarAula.html'));
});


app.listen(port, ()=> console.log(`Listening on http://localhost:${port}`));
