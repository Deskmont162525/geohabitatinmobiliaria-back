const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const {
  createAgente,
  getAllAgentes,
  getAgenteById,
  updateAgente,
  deleteAgente,
  crearInfoImage,
} = require("../controllers/agente.controller");

router.post("/agente", createAgente);
router.get("/agente", getAllAgentes);
router.get("/agente/:id", getAgenteById);
router.put("/agente/:id", updateAgente);
router.delete("/agente/:id", deleteAgente);
router.use(
  "/agente/info-images/:id_usuario",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  crearInfoImage
);


module.exports = router;



