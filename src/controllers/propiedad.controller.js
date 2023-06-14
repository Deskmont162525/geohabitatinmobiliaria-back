// Importar el modelo de Propiedad
const Propiedad = require("../models/propiedad.model");

// Controlador para crear una nueva propiedad
exports.createPropiedad = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipo,
      direccion,
      ciudad,
      estado,
      precio,
      habitaciones,
      banos,
      agente_id,
      zona_comun,
      cocina,
      ropas,
      parqueadero,
      unidad,
      barrio,
      comuna,
      observaciones,
    } = req.body;

    // Verificar si el título ya existe en la base de datos
    const propiedadExistente = await Propiedad.findOne({ titulo });
    if (propiedadExistente) {
      return res
        .status(200)
        .json({ message: "El título ya está en uso", code: 400 });
    }

    const nuevaPropiedad = new Propiedad({
      titulo,
      descripcion,
      tipo,
      direccion,
      ciudad,
      estado,
      precio,
      habitaciones,
      banos,
      agente_id,
      zona_comun,
      cocina,
      ropas,
      parqueadero,
      unidad,
      barrio,
      comuna,
      observaciones,
    });

    const propiedadCreada = await nuevaPropiedad.save();

    res
      .status(201)
      .json({
        message: "propiedad creada con exito",
        code: 201,
        data: propiedadCreada,
      });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al crear propiedad", code: 500 });
  }
};

// Controlador para obtener todas las propiedades
exports.getAllPropiedades = async (req, res) => {
    try {
      const propiedades = await Propiedad.find();
      res.status(200).json({ message: "Propiedades encontradas", code: 200, data: propiedades });
    } catch (error) {
      console.error(error);
      res.status(200).json({ message: "Error al obtener propiedades de la base de datos", code: 500 });
    }
  };
  
// Controlador para obtener una propiedad por su ID
exports.getPropiedadById = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);
    if (!propiedad) {
      // Si no se encuentra la propiedad, se devuelve una respuesta con estado 404 y un mensaje
      return res
        .status(200)
        .json({ message: "Propiedad no encontrada", code: 404 });
    }
    res
      .status(200)
      .json({
        message: "Propiedad encontrada ok",
        code: 200,
        propiedad: propiedad,
      });
  } catch (error) {
    if (error.kind === "ObjectId") {
      // Si el formato del ID es incorrecto, se devuelve una respuesta con estado 400 y un mensaje
      return res
        .status(200)
        .json({ message: "ID de propiedad inválido", code: 400 });
    }
    console.error(error);
    res
      .status(200)
      .json({
        message: "Error al obtener propiedad en base de datos",
        code: 500,
      });
  }
};

// Controlador para actualizar una propiedad
exports.updatePropiedad = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipo,
      direccion,
      ciudad,
      estado,
      precio,
      habitaciones,
      banos,
      agente_id,
      zona_comun,
      cocina,
      ropas,
      parqueadero,
      unidad,
      barrio,
      comuna,
      observaciones,
    } = req.body;

    const propiedad = await Propiedad.findById(req.params.id);
    if (!propiedad) {
      return res
        .status(200)
        .json({ message: "Propiedad no encontrada", code: 404 });
    }

    propiedad.titulo = titulo;
    propiedad.descripcion = descripcion;
    propiedad.tipo = tipo;
    propiedad.direccion = direccion;
    propiedad.ciudad = ciudad;
    propiedad.estado = estado;
    propiedad.precio = precio;
    propiedad.habitaciones = habitaciones;
    propiedad.banos = banos;
    propiedad.agente_id = agente_id;
    propiedad.zona_comun = zona_comun;
    propiedad.cocina = cocina;
    propiedad.ropas = ropas;
    propiedad.parqueadero = parqueadero;
    propiedad.unidad = unidad;
    propiedad.barrio = barrio;
    propiedad.comuna = comuna;
    propiedad.observaciones = observaciones;

    await propiedad.save();

    res
      .status(200)
      .json({ message: "Propiedad actualizada correctamente", code: 200 });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(200)
        .json({ message: "ID de propiedad inválido", code: 400 });
    }
    console.error(error);
    res
      .status(200)
      .json({
        message: "Error al obtener propiedad en base de datos",
        code: 500,
      });
  }
};

// Controlador para eliminar una propiedad
exports.deletePropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);
    if (!propiedad) {
      return res
        .status(200)
        .json({ message: "Propiedad no encontrada", code: 404 });
    }

    propiedad.estado = false;
    await propiedad.save();

    res
      .status(200)
      .json({
        message: "Propiedad marcada como inactiva correctamente",
        code: 200,
      });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(200)
        .json({ message: "ID de propiedad inválido", code: 400 });
    }
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener propiedad en base de datos",
        code: 500,
      });
  }
};
