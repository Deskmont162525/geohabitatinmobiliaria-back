const fs = require("fs-extra");
const { uploadImage } = require("../utils/cloudinary");
const Agente = require("../models/agente.model");
const Usuario = require("../models/user.model");

// Controlador para crear un agente
exports.createAgente = async (req, res) => {
  try {
    const { id_usuario, descripcion, imagen } = req.body;

    const nuevoAgente = new Agente({
      id_usuario,
      descripcion,
      imagen,
    });

    const agenteCreado = await nuevoAgente.save();

    res.status(201).json({
        message: "agente creado con exito",
        code: 201,
        data: agenteCreado,
      });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al crear agente", code: 500 });
  }
};

// Controlador para obtener todos los agentes
exports.getAllAgentes = async (req, res) => {
  try {
    const agentes = await Agente.find();
    res.status(200).json({ message: "agentes encontrados", code: 200, data: agentes });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al obtener agentes", code: 500 });
  }
};

// Controlador para obtener un agente por su ID
exports.getAgenteById = async (req, res) => {
  try {
    const agente = await Agente.findById(req.params.id);
    if (!agente) {
      return res.status(200).json({ message: "Agente no encontrado", code: 404 });
    }
    res.status(200).json(agente);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(200).json({ message: "ID de agente inválido", code: 400 });
    }
    console.error(error);
    res.status(200).json({ message: "Error al obtener agente", code: 500 });
  }
};

// Controlador para actualizar un agente
exports.updateAgente = async (req, res) => {
  
  try {
    const { id_usuario, descripcion, imagen } = req.body;
    
    const agente = await Agente.findById(req.params.id);
    if (!agente) {
      return res.status(200).json({ message: "Agente no encontrado", code: 404 });
    }

    agente.id_usuario = id_usuario;
    agente.descripcion = descripcion;
    agente.imagen = imagen;
    await agente.save();

    res.status(200).json({ message: "Agente actualizado correctamente", code: 200 });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(200).json({ message: "ID de agente inválido", code: 400 });
    }
    console.error(error);
    res.status(200).json({ message: "Error al actualizar agente", code: 500 });
  }
};

// Controlador para eliminar un agente
exports.deleteAgente = async (req, res) => {
  try {
    const agente = await Agente.findById(req.params.id);
    if (!agente) {
      return res.status(200).json({ message: "Agente no encontrado", code: 404 });
    }

    const usuario = await Usuario.findById(agente.id_usuario);
    if (!usuario) {
      return res
        .status(200)
        .json({ message: "Usuario del agente no encontrado", code: 404 });
    }

    usuario.estado = false;
    await usuario.save();

    res.status(200).json({ message: "Agente eliminado correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al eliminar agente", code: 500});
  }
};

exports.crearInfoImage = async  (req, res) => {
  try {
    const { id_usuario } = req.params;
    console.log("llama la funcion ",req.files?.image)
    if (req.files?.image) {
      console.log("llama la funcion ",req.files?.image)
      const result = await uploadImage(
        req.files.image.tempFilePath,
        id_usuario
      );
      console.log("result", result);
      await fs.unlink(req.files.image.tempFilePath);
      res.status(200).json({
        mensaje: "Información de imagen creada exitosamente",
        code: 200,
        result: result,
      });
    } else {
      res.status(400).json({
        mensaje: "No se encontró ninguna imagen adjunta",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "No se pudo crear la información de la imagen",
      error: error.message,
    });
  }
}

// exports.crearInfoImage = async (req, res) => {
//   try {
//     const { id_usuario } = req.params;
//     console.log("llama la funcion ",req.files?.image)
//     if (req.files && req.files.image) {
//       const image = req.files.image;
//       const tempFilePath = image.tempFilePath;
//       console.log("entra al if  ")
//       const result = await uploadImage(tempFilePath, id_usuario);

//       fs.unlink(tempFilePath, (error) => {
//         if (error) {
//           console.error("Error al eliminar el archivo temporal:", error);
//         }
//       });

//       res.status(200).json({
//         mensaje: "Información de imagen creada exitosamente",
//         code: 200,
//         result: result,
//       });
//     } else {
//       console.log("entra al else  ")
//       res.status(400).json({
//         mensaje: "No se encontró ninguna imagen adjunta",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     console.log("entra al if  ",error)
//     res.status(500).json({
//       mensaje: "No se pudo crear la información de la imagen",
//       error: error.message,
//     });
//   }
// };

