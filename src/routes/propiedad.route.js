const express = require("express");
const router = express.Router();
const {
  createPropiedad,
  getPropiedadById,
  updatePropiedad,
  deletePropiedad,
  getAllPropiedades,
} = require("../controllers/propiedad.controller");

router.post("/propiedad", createPropiedad);
router.get("/propiedad", getAllPropiedades);
router.get("/propiedad/:id", getPropiedadById);
router.put("/propiedad/:id", updatePropiedad);
router.delete("/propiedad/:id", deletePropiedad);

module.exports = router;
