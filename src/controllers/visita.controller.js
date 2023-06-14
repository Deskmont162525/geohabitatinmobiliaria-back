const Visita = require("../models/visita.model");

// Controlador para obtener una visita por su ID
exports.getVisitaById = async (req, res) => {
  try {
    const visitaId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(visitaId)) {
      return res.status(400).json({ message: "ID de visita inválido" });
    }

    const visita = await Visita.findById(visitaId);
    if (!visita) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    res.status(200).json({ message: "Visita Encontrada ok", code: 200, data:visita });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener visita" });
  }
};

// Controlador para crear una nueva visita
exports.createVisita = async (req, res) => {
  try {
    const { id_inmueble, interesado_id, fecha_visita, comentarios } = req.body;

    const nuevaVisita = new Visita({
      id_inmueble,
      interesado_id,
      fecha_visita,
      comentarios,
    });

    const visitaCreada = await nuevaVisita.save();

    res.status(201).json({ message: "Visita creada ok", code: 201, data:visitaCreada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear visita" });
  }
};

// Controlador para actualizar una visita
exports.updateVisita = async (req, res) => {
  try {
    const { observaciones, realizada } = req.body;

    const visita = await Visita.findById(req.params.id);
    if (!visita) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    visita.observaciones = observaciones;
    visita.realizada = realizada;
    await visita.save();

    res.status(200).json({ message: "Visita actualizada correctamente" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID de visita inválido" });
    }
    console.error(error);
    res.status(500).json({ message: "Error al actualizar visita" });
  }
};

// Controlador para obtener todas las visitas
exports.getAllVisitas = async (req, res) => {
    try {
      const visitas = await Visita.find();
      res.status(200).json({ message: "Visita Encontrada ok", code: 200, data:visitas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener visitas" });
    }
  };
  

// Controlador para eliminar una visita
exports.deleteVisita = async (req, res) => {
  try {
    const visita = await Visita.findById(req.params.id);
    if (!visita) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    await visita.remove();

    res.status(200).json({ message: "Visita eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar visita" });
  }
};
