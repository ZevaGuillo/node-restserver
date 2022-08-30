 
/* {
    name: 'ass,
    email:,
    password:
    img: ,
    rol: ,
    state: true | false
    google: true | false
    }
 */

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String,
    }, 
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: String,
        default: true,
    }, 
    google: {
        type: String,
        default: false,
    }
});

// Sobreescribir el metodo de impresion en json
UsuarioSchema.methods.toJSON = function(){
    const { __v, password , ...usuario} = this.toObject();
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );