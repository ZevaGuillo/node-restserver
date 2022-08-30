const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {
  // const { q, nombre='no name', apikey } = req.query;
  const { limit = 5, desde = 0 } = req.query;
  const query = { state: true }

  // Se ejecuta de manera ssilmutanea
  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments(query),
    // Paginación
    Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limit))
  ])

  res.json({
    total,
    usuarios
  });
};

const usuariosPut = async(req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO Validar contra base de datos
  if( password ){
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPost = async (req, res = response) => {

  const { name, email, password, rol} = req.body;
  const usuario = new Usuario({ name, email, password, rol });

  // Verificar si el correo existe
  

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt );

  // Guardar en BD
  await usuario.save();

  res.json({
    usuario
  });

};

const usuariosDelete = async (req, res = response) => {

  const { id } = req.params;

  // Borra fisicamente
  // const usuario = await Usuario.findByIdAndDelete( id );

  const usuario = await Usuario.findByIdAndUpdate( id, { state: false} )

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
};
