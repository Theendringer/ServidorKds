const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');




const connection = mysql.createConnection({
  host: 'kds.mysql.database.azure.com',
  user: 'endringer',
  password: 'g24252627@G',
  database: 'bancoKds',
});


// Middleware para permitir JSON nas requisições
app.use(express.json());

// Configuração do CORS para permitir requisições do seu aplicativo React
app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  cors({
    origin: 'http://localhost:3001', // ou o domínio onde seu aplicativo React está hospedado
    methods: ['GET', 'POST', 'PUT'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  })
);

// Rota GET para obter todos os pedidos
app.get('/api/pedidos', (req, res) => {
  connection.query('SELECT * FROM pedido', (err, results) => {
    if (err) {
      res.status(500).send('Erro ao buscar pedidos');
      return;
    }
    res.json(results);
  });
});

// Rota POST para criar um novo pedido
app.post('/api/pedido', (req, res) => {
  const { produto, observacoes, numeroMesa, nomeCliente, dataCriacao, dataFim, status } = req.body;
  const newPedido = {
    produto,
    observacoes,
    numeroMesa,
    nomeCliente,
    dataCriacao,
    dataFim,
    status,
  };

  connection.query('INSERT INTO pedido SET ?', newPedido, (err, results) => {
    if (err) {
      res.status(500).send('Erro ao criar um novo pedido');
      return;
    }
    res.status(201).send('Novo pedido criado');
  });
});

// Rota PUT para atualizar um pedido por ID
app.put('/api/pedido/:id', (req, res) => {
  const { id } = req.params;
  const updatedPedido = req.body;

  connection.query('UPDATE pedido SET ? WHERE id = ?', [updatedPedido, id], (err, results) => {
    if (err) {
      res.status(500).send(`Erro ao atualizar o pedido ${id}`);
      return;
    }
    res.send(`Pedido ${id} atualizado`);
  });
});

// Iniciando o servidor
app.all('/', (req, res) => {
  console.log("Just got a request!");
  res.send('Yo!');
});

app.listen(process.env.PORT || 3000);
