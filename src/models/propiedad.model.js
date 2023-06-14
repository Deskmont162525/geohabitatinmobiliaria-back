const mongoose = require('mongoose');

const propiedadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  habitaciones: {
    type: Number,
    required: true
  },
  banos: {
    type: Number,
    required: true
  },
  agente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agente',
    required: true
  },
  zona_comun: {
    type: String,
    required: true
  },
  cocina: {
    type: String,
    required: true
  },
  ropas: {
    type: String,
    required: true
  },
  parqueadero: {
    type: Boolean,
    required: true
  },
  unidad: {
    type: Boolean,
    required: true
  },
  barrio: {
    type: String,
    required: true
  },
  comuna: {
    type: String,
    required: true
  },
  observaciones: {
    type: String,
    required: true
  }
});

const Propiedad = mongoose.model('Propiedad', propiedadSchema);

module.exports = Propiedad;
