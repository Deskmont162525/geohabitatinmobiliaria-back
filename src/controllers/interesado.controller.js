const Interesado = require("../models/interesado.model");
const mongoose = require("mongoose");

// Controlador para crear un nuevo interesado
exports.createInteresado = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;

    const nuevoInteresado = new Interesado({
      nombre,
      email,
      telefono,
    });

    const interesadoCreado = await nuevoInteresado.save();

    res
      .status(201)
      .json({
        message: "Interesado creado ok",
        code: 201,
        data: interesadoCreado,
      });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al crear interesado", code: 500 });
  }
};

// Controlador para obtener todos los interesados
exports.getInteresados = async (req, res) => {
  try {
    const interesados = await Interesado.find();
    res
      .status(200)
      .json({
        message: "Interesados encontrados ok",
        code: 200,
        data: interesados,
      });
  } catch (error) {
    console.error(error);
    res
      .status(200)
      .json({ message: "Error al obtener interesados", code: 500 });
  }
};

// Controlador para obtener un interesado por su ID
exports.getInteresadoById = async (req, res) => {
  try {
    const interesado = await Interesado.findById(req.params.id);
    if (!interesado) {
      return res
        .status(200)
        .json({ message: "Interesado no encontrado", code: 404 });
    }
    res.status(200).json(interesado);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(200)
        .json({ message: "ID de interesado inválido", code: 400 });
    }
    console.error(error);
    res.status(200).json({ message: "Error al obtener interesado", code: 500 });
  }
};

// Controlador para actualizar un interesado
exports.updateInteresado = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const interesado = await Interesado.findById(req.params.id);
    if (!interesado) {
      return res
        .status(200)
        .json({ message: "Interesado no encontrado", code: 404 });
    }

    interesado.nombre = nombre;
    interesado.email = email;
    interesado.telefono = telefono;
    await interesado.save();

    res
      .status(200)
      .json({ message: "Interesado actualizado correctamente", code: 200 });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(200)
        .json({ message: "ID de interesado inválido", code: 400 });
    }
    console.error(error);
    res
      .status(200)
      .json({ message: "Error al actualizar interesado", code: 500 });
  }
};

// Controlador para eliminar un interesado
exports.deleteInteresado = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID de Interesado inválido", code: 400 });
    }

    const interesado = await Interesado.findById(id);
    if (!interesado) {
      return res.status(404).json({ message: "Interesado no encontrado", code: 404 });
    }

    await Interesado.findByIdAndRemove(id);

    res.status(200).json({ message: "Interesado eliminado correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar interesado", code: 500 });
  }
};


// Controlador para eliminar varios interesados por ID
exports.deleteMultipleInteresados = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validar que los IDs sean válidos
    const isValidIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!isValidIds) {
      return res.status(400).json({ message: "IDs inválidos", code: 400 });
    }

    const deletePromises = ids.map((id) => Interesado.findByIdAndRemove(id));

    await Promise.all(deletePromises);

    res
      .status(200)
      .json({ message: "Interesados eliminados correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar interesados", code: 500 });
  }
};
