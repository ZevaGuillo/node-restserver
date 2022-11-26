const { Router } = require("express");
const { check } = require("express-validator");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoria: existeCategoriaById } = require("../helpers/db-validators");
const { validarJWT, esAdminRole } = require("../middlewares");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

/* 
    {{url}}/api/categorias
*/

// Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// Obtener una categorias por id - publico
router.get("/:id",[
  check("id", "No es un ID válido").isMongoId(),
  check('id').custom( existeCategoriaById ),
  validarCampos
] , obtenerCategoria);

// crear categoria - privado - cualquier persona con un token valido
router.post("/", [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ], crearCategoria);

// actualizae categoria - privado . cualquier personac on token valido
router.put("/:id",[
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check('id').custom( existeCategoriaById ),
    validarCampos,
], actualizarCategoria);

// borrar una categoria - admin . cualquier personac on token valido
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos,
] ,borrarCategoria);
module.exports = router;
