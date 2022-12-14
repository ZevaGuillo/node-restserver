const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
    }

    // Conectar DB
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de la aplicacion
    this.routes();
  }

  async conectarDB(){
    await dbConnection();
  }

  middlewares() {
    // Directorio publico
    this.app.use(cors())

    // Lectura y parseo del body
    this.app.use( express.json() );

    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    
    this.app.use( this.paths.auth , require('../routes/auth'));
    this.app.use( this.paths.buscar , require('../routes/buscar'));
    this.app.use( this.paths.usuarios , require('../routes/user'));
    this.app.use( this.paths.categorias , require('../routes/categorias'));
    this.app.use( this.paths.productos , require('../routes/productos'));

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto ", this.port);
    });
  }
}

module.exports = Server;
