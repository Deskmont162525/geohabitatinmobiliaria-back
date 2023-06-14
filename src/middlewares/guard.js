const bcrypt = require("bcryptjs");
const Formulario = require("../models/forms");
const { isValidObjectId } = require('mongoose');

const validarCodigo = async (req, res, next) => {
  const codigo = req.headers["codigo-autorizacion"];

  if (!codigo) {
    return res
      .status(200)
      .json({ mensaje: "No se proporcionó el código de autorización", code: 401 });
  }

  // Aquí deberíamos obtener el código encriptado almacenado en lugar de 'codigo_encriptado'
  const codigoEncriptado = process.env.CODIGO_SECRETO_APP;

  if (codigo === codigoEncriptado) {
    next();
  } else {
    return res
      .status(200)
      .json({ mensaje: "Código de autorización incorrecto", code: 401 });
  }
};

const validarIdFormulario = async (req, res, next) => {
  const idFormulario = req.body.id; // Obtener el ID del formulario del body de la solicitud
 
  // Verificar si el ID de formulario es válido
  if (!isValidObjectId(idFormulario)) {
    return res.status(400).json({ mensaje: "El ID de formulario no es válido", code: 400 });
  }

  try {
    const formulario = await Formulario.findById(idFormulario);

    if (formulario) {
      if (formulario.estado) {
        // El ID de formulario existe y está activo
        next();
      } else {
        // El ID de formulario existe, pero no está activo
        return res.status(400).json({ mensaje: "El ID de formulario existe, pero no está activo", code: 400 });
      }
    } else {
      // El ID de formulario no existe
      return res.status(404).json({ mensaje: "El ID de formulario no existe", code: 404 });
    }
  } catch (error) {
    // Error al buscar en la base de datos
    console.error(error);
    return res.status(500).json({ mensaje: "Error al buscar el ID de formulario en la base de datos", code: 500 });
  }
};



module.exports = {
  validarCodigo,
  validarIdFormulario
};

