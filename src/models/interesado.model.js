const mongoose = require('mongoose');

const interesadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  }
});

const Interesado = mongoose.model('Interesado', interesadoSchema);

module.exports = Interesado;
