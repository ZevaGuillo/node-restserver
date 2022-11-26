const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido =  async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }

} 

const emailExiste = async( email = '' ) =>{
    const existeEmail = await Usuario.findOne({ email });
    if( existeEmail ){
        throw new Error("Ese correo ya está registrado");
    }
}

const existeUsuarioPorId = async( id = '' ) =>{
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error(`El id no existe: ${id}`);
    }
}

const existeCategoriaByID = async(id= '')=>{
    const isEmptyCategoria = await Categoria.findById(id);
    if( !isEmptyCategoria ){
        throw new Error(`El producto con el id: ${id}, no existe`);
    }
}

const existeProductoByID = async(id= '')=>{
    const isEmptyProducto = await Producto.findById(id);
    if( !isEmptyProducto ){
        throw new Error(`El producto con el id: ${id}, no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria: existeCategoriaByID,
    existeProductoByID
}