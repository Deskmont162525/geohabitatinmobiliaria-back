const express = require('express');
const router = express.Router();
const {
  createInteresado,
  getInteresados,
  getInteresadoById,
  updateInteresado,
  deleteInteresado,
  deleteMultipleInteresados
} = require('../controllers/interesado.controller');

router.post('/interesado', createInteresado);
router.get('/interesado', getInteresados);
router.get('/interesado/:id', getInteresadoById);
router.put('/interesado/:id', updateInteresado);
router.delete('/interesado/:id', deleteInteresado);
router.post('/interesado/delete-multiple', deleteMultipleInteresados);

module.exports = router;

