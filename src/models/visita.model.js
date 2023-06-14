const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  id_inmueble: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Propiedad',
    required: true
  },
  interesado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interesado',
    required: true
  },
  fecha_visita: {
    type: Date,
    required: true
  },
  realizada: {
    type: Boolean,
    default: false
  },
  comentarios: { type: String }
});

const Visita = mongoose.model('Visita', visitaSchema);

module.exports = Visita;
