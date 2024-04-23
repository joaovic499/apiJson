const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

const usuariosFilePath = 'usuarios.json';


app.get('/usuarios', (req, res) =>{
    fs.readFile(usuariosFilePath, 'utf8', (err,data) => {
        if (err) {
            console.error(err)
            return res.status(500).send('Erro Interno do Servidor');
        }

    const usuarios = JSON.parse(data);
    res.json(usuarios);
    });
});

app.post('/usuarios', (req, res ) => {
    const { usuario, senha, codigo } = req.body;
    if(!usuario || !senha || codigo ) {
        return res.status(400).send("Usuario, senha e codigo sao obrigatorios");
    }

    fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send('Erro interno do servidor');
        }
    
        res.status(201).send("Usuario Criado com sucesso");
    });
});


app.put('/usuarios/:id', (req, res) =>{
    const id = req.params.id;
    const { usuario, senha, codigo } = req.body;

    fs.readFile(usuariosFilePath, 'utf8', (err,data) =>{
        if (err) {
            console.error(err);
            return res.status(500).send('Erro interno do servidor');
        }

        const usarios = JSON.parse(data);
        const usuarioIndex = usuarios.findIndex(u => u.codigo === id);

        if (usuarioIndex === -1){
            return res.status(404).send('Usuario nao encontrado');
        }

        usuarios[usuarioIndex] = { usuario, senha, codigo: id};

        fs.writeFile(usuariosFilePath, JSON.stringify(usuarios), err =>{
            if (err) {
                console.error(err);
                return res.status(500).send('Erro interno do servidor');
            }
        
        res.send('Usuario atualizado com sucesso');
        });
    });
 });


 //Rota para deletar um usuario

 app.delete('/usuarios/:id', (req, res) =>{
    const id = req.params.id;

    fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro interno do servidor');
        }

        let usuarios = JSON.parse(data);
        usuarios = usuarios.filter(u => u.codigo !== id);

        fs.writeFile(usuariosFilePath, JSON.stringify(usuarios), err => {
            if (err){
                console.error(err);
                return res.status(500).send('Erro interno do servidor');
            }
        
            res.send('Usuario deletado com sucesso');

         });
    });
 });

 app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
 });