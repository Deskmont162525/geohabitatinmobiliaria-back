const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const multer = require("multer");
const { dirname, join, extname } = require("path");

const CURRENT_DIR = __dirname;
const MIMETYPES = ['image/*'];
const multerUpload = multer({
  storage: multer.diskStorage({
      destination: join(CURRENT_DIR, '../../uploads'),
      filename: (req, file, cb) => {
          const fileExtension = extname(file.originalname);
          const fileName = file.originalname.split(fileExtension)[0];

          cb(null, `${fileName}-${Date.now()}${fileExtension}`);
      },
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
      fieldSize: 10000000,
  },
});


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

router.post('/agente/upload/:id_usuario', multerUpload.single('image'), crearInfoImage);

module.exports = router;

