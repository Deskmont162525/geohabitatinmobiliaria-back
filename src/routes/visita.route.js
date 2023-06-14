const express = require("express");
const router = express.Router();
const {
  createVisita,
  getAllVisitas,
  getVisitaById,
  updateVisita,
  deleteVisita,
} = require("../controllers/visita.controller");

router.post("/visita", createVisita);
router.get("/visita", getAllVisitas);
router.get("/visita/:id", getVisitaById);
router.put("/visita/:id", updateVisita);
router.delete("/visita/:id", deleteVisita);

module.exports = router;
