const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

router.post(
  '/',
  [
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),

    check('email', 'Agrega un Email válido').isEmail(),
    check('password', 'Agrega un password correcto, min 6 caracteres').isLength(
      { min: 6 }
    ),
  ],

  usuarioController.nuevoUsuario
);

module.exports = router;
