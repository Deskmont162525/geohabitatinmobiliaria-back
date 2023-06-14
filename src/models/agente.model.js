const mongoose = require('mongoose');

const agenteSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  descripcion: { type: String, required: true },
  imagen: {
    type: Object,
    required: true
  }
});

const Agente = mongoose.model('Agente', agenteSchema);

module.exports = Agente;
