// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

//Modelo
var Usuario =  require('../models/usuario');

//Métodos
app.post('/',(req, res)=>{

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }   

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            })
        }

        //Crear un token!!
        usuarioDB.password = ':)'
        var token = jwt.sign({ usuario: usuarioDB }, SEED ,{ expiresIn: 14400 }) //4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        })  

    });

    

});


//Exportar
module.exports = app;