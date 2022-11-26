const { Router } = require("express");
const { check } = require("express-validator");
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { existeProductoByID, existeCategoria } = require("../helpers/db-validators");
const { validarJWT, esAdminRole } = require("../middlewares");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

/* 
    {{url}}/api/productos
*/

// Obtener todas las productos - publico
router.get("/", obtenerProductos);

// Obtener una productos por id - publico
router.get("/:id",[
  check("id", "No es un ID válido").isMongoId(),
  check('id').custom( existeProductoByID ),
  validarCampos
] , obtenerProducto);

// crear producto - privado - cualquier persona con un token valido
router.post("/", [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de mongo").isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos,
  ], crearProducto);

// actualizae producto - privado . cualquier personac on token valido
router.put("/:id",[
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check('id').custom( existeProductoByID ),
    validarCampos,
], actualizarProducto);

// borrar una producto - admin . cualquier personac on token valido
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check('id').custom( existeProductoByID ),
    validarCampos,
] , borrarProducto);

module.exports = router;
