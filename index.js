const express = require('express');
const bcrypt = require('bcrypt')
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

const usuariosFilePath = 'usuarios.json';


// Rota para listar todos os usuários
app.get('/usuarios', (req, res) => {
  fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro interno do servidor');
    }

    const usuarios = JSON.parse(data);
    res.json(usuarios);
  });
});

// Rota para buscar um usuário pelo ID
app.get('/usuarios/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro interno do servidor');
    }

    const usuarios = JSON.parse(data);
    const usuario = usuarios.find(u => u.id === parseInt(id));

    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.json(usuario);
  });
});

// Rota para criar um novo usuário
app.post('/usuarios', async (req, res) => {
  try{
    const hashedPaswword = await bcrypt.hash(req.body.senha, 10);
    const usuario = { usuario: req.body.usuario, senha: hashedPaswword, codigo: req.body.codigo};

   fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro interno do servidor');
    }

    let usuarios = JSON.parse(data);
    usuarios.push(usuario);

    fs.writeFile(usuariosFilePath, JSON.stringify(usuarios, null, 2), err => {
      if (err){
        console.error(err);
          console.error(err);
          return res.status(500).send('Erro interno do servidor');
        }
        res.status(201).send("Usuario criado com sucesso");
      });
    });
   } catch {
    res.status(500).send("Erro ao criar o usuario");
   }
});
 
// Rota para atualizar um usuário existente
app.put('/usuarios/:id', (req, res) => {
  const id = req.params.id;
  const { usuario, senha } = req.body;

  fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro interno do servidor');
    }

    const usuarios = JSON.parse(data);
    const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));

    if (usuarioIndex === -1) {
      return res.status(404).send('Usuário não encontrado');
    }

    usuarios[usuarioIndex] = { id: parseInt(id), usuario, senha };

    fs.writeFile(usuariosFilePath, JSON.stringify(usuarios), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro interno do servidor');
      }

      res.send('Usuário atualizado com sucesso');
    });
  });
});

// Rota para deletar um usuário
app.delete('/usuarios/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro interno do servidor');
    }

    let usuarios = JSON.parse(data);
    usuarios = usuarios.filter(u => u.id !== parseInt(id));

    fs.writeFile(usuariosFilePath, JSON.stringify(usuarios), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro interno do servidor');
      }

      res.send('Usuário deletado com sucesso');
    });
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
