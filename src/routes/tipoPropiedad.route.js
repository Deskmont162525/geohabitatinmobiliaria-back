const express = require('express');
const router = express.Router();
const {
  createTipoPropiedad,
  getTiposPropiedad,
  getTipoPropiedadById,
  updateTipoPropiedad,
  deleteTipoPropiedad,
  deleteMultipleTipoPropiedad
} = require('../controllers/tipoPropiedad.controller');

router.post('/tipoPropiedad', createTipoPropiedad);
router.get('/tipoPropiedad', getTiposPropiedad);
router.get('/tipoPropiedad/:id', getTipoPropiedadById);
router.put('/tipoPropiedad/:id', updateTipoPropiedad);
router.delete('/tipoPropiedad/:id', deleteTipoPropiedad);
router.post('/tipoPropiedad/delete-multiple', deleteMultipleTipoPropiedad);

module.exports = router;
