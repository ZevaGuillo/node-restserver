const { response, json } = require("express")
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) =>{

    const { email, password } = req.body;

    try {

        // Veridicar si el email existe
        const usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }


        // Si el usuario está activo
        if(! usuario.state){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }


        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async(req, res = response) =>{
    const { id_token } = req.body;

    
    try {

        const {name, img, email} = await googleVerify(id_token)

        let usuario = await Usuario.findOne({email})

        // Usuario creado
        if(usuario==null){
            console.log('funciona cas');
            const data = {
                name,
                email,
                password: ':p',
                img,
                rol:"USER_ROLE",
                google: true
            }
            usuario = new Usuario(data)
            await usuario.save();
        }


        // Si el usuario en DB
        if(!usuario.state){
            return res.status(401).json({
                msg: 'Hable con el admin'
            })
        }

// Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(400).json({
            msg: 'El token no se pudo verificae',
            error
        })
    }


}

module.exports = {
    login,
    googleSignIn
}