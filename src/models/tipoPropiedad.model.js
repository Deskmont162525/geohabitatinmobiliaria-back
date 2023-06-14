const mongoose = require('mongoose');

const tipoPropiedadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  }
});

const TipoPropiedad = mongoose.model('TipoPropiedad', tipoPropiedadSchema);

module.exports = TipoPropiedad;
