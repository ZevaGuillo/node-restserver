const { response } = require("express");
const {Categoria} = require('../models')

// obtener categorias - paginado - total - populate
const obtenerCategorias = async(req, res = response)=>{
    const { limit = 5, desde = 0 } = req.query;
    const queryCategoria = { state: true }
  
    // Se ejecuta de manera ssilmutanea
    const [ total, categoria ] = await Promise.all([
      Categoria.countDocuments(queryCategoria),
      // Paginación
      Categoria.find(queryCategoria)
          .skip(Number(desde))
          .limit(Number(limit))
          .populate("usuario", "name")
    ])
  
    res.json({
      total,
      usuarios: categoria
    });
}

// obtener categoria - populate - {}
const obtenerCategoria = async(req, res = response)=>{
    const id = req.params.id;

    const categoriaByID = await Categoria.findOne({id}).populate("usuario", "name");

    res.status(200).json(categoriaByID)
}



const crearCategoria = async(req , res=response)=>{

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    // generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria)

}

// actualizar categoria 
const actualizarCategoria = async(req, res= response)=>{
    const id = req.params.id;
    const {state, usuario,...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}


// borrarCategoria - estado:false
const borrarCategoria = async(req, res = response)=>{
    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate(id, {state:false}, {new: true});

    res.json(categoria);
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}