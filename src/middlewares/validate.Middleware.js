const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const validarIdUsuario = (req, res, next) => {
  const idUsuario = req.body.id_usuario;

  if (
    !idUsuario ||
    typeof idUsuario !== "string" ||
    !idUsuario.startsWith("K")
  ) {
    return res.status(400).json({
      mensaje:
        "El id de usuario es requerido y debe ser un string que empiece con 'K' mayúscula",
      code: 3003,
    });
  }
  next();
};

function isValidUserId(userId) {
  const hasHyphen = userId.includes('-');
  const tipoId = {
    _id: false,
    temp_id: false
  };
  if (hasHyphen) {
    tipoId.temp_id = true;
    return tipoId;
  } else {
    // Validar el formato de ObjectId de MongoDB
    if (ObjectId.isValid(userId)) {
      tipoId._id = true;
    }
    return tipoId;
  }
}



module.exports = { validarIdUsuario, isValidUserId };
