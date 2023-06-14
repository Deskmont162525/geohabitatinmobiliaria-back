const TipoPropiedad = require("../models/tipoPropiedad.model");
const mongoose = require("mongoose");

// Crear un nuevo tipo de propiedad
exports.createTipoPropiedad = async (req, res) => {
  try {
    const { nombre } = req.body;

    const nuevoTipoPropiedad = new TipoPropiedad({
      nombre,
    });

    const tipoPropiedadCreado = await nuevoTipoPropiedad.save();

    res.status(201).json({
      message: "Tipo Propiedades encontrados ok",
      code: 201,
      data: tipoPropiedadCreado,
    });
  } catch (error) {
    console.error(error);
    res
      .status(200)
      .json({ message: "Error al crear tipo de propiedad", code: 500 });
  }
};

// Obtener todos los tipos de propiedad
exports.getTiposPropiedad = async (req, res) => {
  try {
    const tiposPropiedad = await TipoPropiedad.find();
    res.status(200).json({
      message: "Tipo Propiedades encontrados ok",
      code: 200,
      data: tiposPropiedad,
    });
  } catch (error) {
    console.error(error);
    res
      .status(200)
      .json({ message: "Error al obtener tipos de propiedad", code: 500 });
  }
};

// Obtener un tipo de propiedad por su ID
exports.getTipoPropiedadById = async (req, res) => {
  try {
    const tipoPropiedad = await TipoPropiedad.findById(req.params.id);
    if (!tipoPropiedad) {
      return res
        .status(200)
        .json({ message: "Tipo de propiedad no encontrado", code: 404 });
    }
    res.status(200).json({
      message: "Tipo Propiedades encontrados ok",
      code: 200,
      data: tipoPropiedad,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(200)
        .json({ message: "ID de tipo de propiedad inválido", code: 400 });
    }
    console.error(error);
    res
      .status(200)
      .json({ message: "Error al obtener tipo de propiedad", code: 500 });
  }
};

// Actualizar un tipo de propiedad
exports.updateTipoPropiedad = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    const tipoPropiedad = await TipoPropiedad.findById(req.params.id);
    if (!tipoPropiedad) {
      return res
        .status(200)
        .json({ message: "Tipo de propiedad no encontrado", code: 404 });
    }

    tipoPropiedad.nombre = nombre;
    tipoPropiedad.estado = estado;
    await tipoPropiedad.save();

    res
      .status(200)
      .json({
        message: "Tipo de propiedad actualizado correctamente",
        code: 200,
      });
  } catch (error) {
    console.error(error);
    res
      .status(200)
      .json({ message: "Error al actualizar tipo de propiedad", code: 500 });
  }
};

// Obtener todos los tipos de propiedad con estado true
exports.getTiposPropiedadActivos = async (req, res) => {
  try {
    const tiposPropiedadActivos = await TipoPropiedad.find({ estado: true });
    res.status(200).json({
      message: "Tipo Propiedades encontrados ok",
      code: 200,
      data: tiposPropiedadActivos,
    });
  } catch (error) {
    console.error(error);
    res
      .status(200)
      .json({
        message: "Error al obtener tipos de propiedad activos",
        code: 500,
      });
  }
};

// Eliminar un tipo de propiedad
exports.deleteTipoPropiedad = async (req, res) => {
  try {
    const tipoPropiedad = await TipoPropiedad.findById(req.params.id);
    if (!tipoPropiedad) {
      return res
        .status(200)
        .json({ message: "Tipo de propiedad no encontrado", code: 404 });
    }

    tipoPropiedad.estado = false;
    await tipoPropiedad.save();

    res
      .status(200)
      .json({
        message: "Tipo de propiedad actualizado correctamente",
        code: 200,
      });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(200)
        .json({ message: "ID de tipo de propiedad inválido", code: 400 });
    }
    console.error(error);
    res.status(500).json({ message: "Error al actualizar tipo de propiedad" });
  }
};

// Eliminar varios tipo de propiedad
exports.deleteMultipleTipoPropiedad = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validar que los IDs sean válidos
    const isValidIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!isValidIds) {
      return res.status(400).json({ message: "IDs inválidos", code: 400 });
    }

    const updatePromises = ids.map((id) =>
      TipoPropiedad.findByIdAndUpdate(id, { estado: false })
    );

    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "Tipo de propiedad actualizados correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar tipo de propiedad", code: 500 });
  }
};
