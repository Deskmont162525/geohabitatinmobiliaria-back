const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importa las rutas
const authRoutes = require('./routes/auth.route');
const roleRoutes = require('./routes/role.route');
const propiedadesRoutes = require('./routes/propiedad.route');
const agentesRoutes = require('./routes/agente.route');
const interesadosRoutes = require('./routes/interesado.route');
const visitasRoutes = require('./routes/visita.route');
const tipoPropiedadesRoutes = require('./routes/tipoPropiedad.route');

// Configura el servidor de Express
const app = express();
app.use(express.json());

// Habilitar CORS
app.use(cors());

// Usa las rutas
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/propiedades', propiedadesRoutes);
app.use('/api/agentes', agentesRoutes);
app.use('/api/interesados', interesadosRoutes);
app.use('/api/visitas', visitasRoutes);
app.use('/api/tipoPropiedades', tipoPropiedadesRoutes);

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

// server listening
const port = process.env.PORT || 587;
app.listen(port, () => console.log("Soy el mejor to", port));

// const mongoose = require("mongoose");
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// // Importa las rutas
// const authRoutes = require('./routes/auth.route');
// const roleRoutes = require('./routes/role.route');
// const propiedadesRoutes = require('./routes/propiedad.route');
// const agentesRoutes = require('./routes/agente.route');
// const interesadosRoutes = require('./routes/interesado.route');
// const visitasRoutes = require('./routes/visita.route');
// const tipoPropiedadesRoutes = require('./routes/tipoPropiedad.route');

// // Configura el servidor de Express
// const app = express();
// app.use(express.json());

// // Configurar opciones de CORS
// const corsOptions = {
//   origin: "*", // Permitir solicitudes desde cualquier origen (no recomendado para producción)
//   methods: ["GET", "POST", "PUT", "DELETE"], // Permitir los métodos HTTP especificados
//   allowedHeaders: ["Content-Type"], // Permitir los encabezados personalizados especificados
// };

// // Habilitar CORS con las opciones configuradas
// app.use(cors(corsOptions));

// // Usa las rutas
// app.use('/api/auth', authRoutes);
// app.use('/api/roles', roleRoutes);
// app.use('/api/propiedades', propiedadesRoutes);
// app.use('/api/agentes', agentesRoutes);
// app.use('/api/interesados', interesadosRoutes);
// app.use('/api/visitas', visitasRoutes);
// app.use('/api/tipoPropiedades', tipoPropiedadesRoutes);

// // mongodb connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch((error) => console.error(error));

// // server listening
// const port = process.env.PORT || 587;
// app.listen(port, () => console.log("Soy el mejor to", port));
