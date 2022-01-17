const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res, next) => {
  // Mostrar mensajes de error de express validator
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // buscar el usuario para ver si esta registrado
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    res.status(401).json({ msg: 'El Usuario no Existe' });
    return next();
  }

  // verificar el password y autenticar el usuario
  if (bcrypt.compareSync(password, usuario.password)) {
    // Crear json web token
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
      },
      process.env.SECRETA,
      {
        expiresIn: '8h',
      }
    );

    res.json({ token }); // token : token
  } else {
    res.status(401).json({ msj: 'Password Incorrecto' });
    return next();
  }
};

exports.usuarioAutenticado = (req, res, next) => {
  res.json({ usuario: req.usuario });
};
