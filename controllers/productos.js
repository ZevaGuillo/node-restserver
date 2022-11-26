const { response } = require("express");
const { Producto } = require("../models");

// obtener productos - paginado - total - populate
const obtenerProductos = async(req, res = response)=>{

    const { limit = 5, desde = 0 } = req.query;
    const queryProducto = { state: true }
  
    // Se ejecuta de manera ssilmutanea
    const [ total, productos ] = await Promise.all([
      Producto.countDocuments(queryProducto),
      // Paginación
      Producto.find(queryProducto)
          .skip(Number(desde))
          .limit(Number(limit))
          .populate("usuario", "name")
    ])
  
    res.json({
      total,
      usuarios: productos
    });


}

// obtener Producto - populate - {}
const obtenerProducto = async(req, res = response)=>{
    const id = req.params.id;

    const ProductoByID = await Producto.findOne({id}).populate("categoria", "nombre");

    res.status(200).json(ProductoByID)
}

const crearProducto = async(req , res=response)=>{

    const {state, usuario, ...body} = req.body;
    

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    // generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id,
    }
   
    const producto = new Producto(data);
    // Guardar DB
    await producto.save();

    res.status(201).json(producto)
}

const actualizarProducto = async(req, res= response)=>{
    const id = req.params.id;
    const {state, usuario,...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

const borrarProducto = async(req, res = response)=>{
    const id = req.params.id;

    const producto = await Producto.findByIdAndUpdate(id, {state:false}, {new: true});

    res.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto

}