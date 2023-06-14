const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Role = require("../models/role.model");
require("dotenv").config();
const { generateToken } = require("../middlewares/crear.token");
const { sendConfirmationEmail } = require("../middlewares/email.send");
const mongoose = require("mongoose");
const crypto = require('crypto');

// Función para encriptar el número telefónico
const encryptPhoneNumber = (phoneNumber, encryptionKey) => {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encryptedPhoneNumber = cipher.update(phoneNumber, 'utf8', 'hex');
  encryptedPhoneNumber += cipher.final('hex');
  return encryptedPhoneNumber;
};

// Función para desencriptar el número telefónico
const decryptPhoneNumber = (encryptedPhoneNumber, encryptionKey) => {
  const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  let decryptedPhoneNumber = decipher.update(encryptedPhoneNumber, 'hex', 'utf8');
  decryptedPhoneNumber += decipher.final('utf8');
  return decryptedPhoneNumber;
};

// Controlador para registrar un nuevo usuario
exports.signup = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      nombres,
      apellidos,
      numero_documento,
      tipo_documento,
      numero_telefonico,
      role,
    } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El correo ya está en uso" });
    }

    // Encriptar la contraseña y el número de teléfono
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedPhoneNumber = encryptPhoneNumber(numero_telefonico, process.env.ACCESS_TOKEN_SECRET);

    // Crear el nuevo usuario con los campos proporcionados
    const user = new User({
      username: username ? username : undefined,
      password: hashedPassword,
      email,
      nombres: nombres ? nombres : undefined,
      apellidos: apellidos ? apellidos : undefined,
      numero_documento: numero_documento ? numero_documento : undefined,
      tipo_documento: tipo_documento ? tipo_documento : undefined,
      numero_telefonico: hashedPhoneNumber,
    });

    // Verificar si se ha proporcionado un rol válido
    if (role) {
      const existingRole = await Role.findOne({ name: role });
      if (!existingRole) {
        return res
          .status(400)
          .json({ message: "El rol proporcionado no es válido" });
      }
      user.role = existingRole._id;
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      user.role = defaultRole._id;
    }

    await user.save();
    await sendConfirmationEmail(user);
    res.status(201).json({
      message: "Usuario registrado correctamente",
      code: 201,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Controlador para iniciar sesión
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Verificar si el usuario existe
//     const user = await User.findOne({ email }).populate("role", "-__v");
//     if (!user) {
//       return res.status(401).json({ message: "Credenciales inválidas" });
//     }

//     // Verificar la contraseña
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Credenciales inválidas" });
//     }

//     if (!user.estado) {
//       try {
//         await sendConfirmationEmail(user);
//         return res.status(401).json({
//           message:
//             "Usuario no está activo debes verificar tu correo y dar clic en el boton verificar cuenta",
//         });
//       } catch (error) {
//         console.error(error);
//         return res
//           .status(500)
//           .json({ message: "Error al enviar correo de confirmación" });
//       }
//     }

//     // Generar el token de acceso
//     const accessToken = jwt.sign(
//       { userId: user._id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "1d" }
//     );
//     res.status(200).json({
//       accessToken,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         nombres: user.nombres,
//         apellidos: user.apellidos,
//         numero_documento: user.numero_documento,
//         tipo_documento: user.tipo_documento,
//         numero_telefonico: user.numero_telefonico,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al iniciar sesión" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verificar si el usuario existe
    const user = await User.findOne({ email }).populate("role", "-__v");
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!user.estado) {
      try {
        await sendConfirmationEmail(user);
        return res.status(401).json({
          message:
            "Usuario no está activo. Debes verificar tu correo y hacer clic en el botón de verificación de cuenta",
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error al enviar correo de confirmación" });
      }
    }

    // Desencriptar el número de teléfono
    const decryptedPhoneNumber = decryptPhoneNumber(user.numero_telefonico, process.env.ACCESS_TOKEN_SECRET)

    // Generar el token de acceso
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        nombres: user.nombres,
        apellidos: user.apellidos,
        numero_documento: user.numero_documento,
        tipo_documento: user.tipo_documento,
        numero_telefonico: decryptedPhoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("role");

    const filteredUsers = users
      .filter((user) => user.role.name !== "superadmin")
      .map((user) => {
        // Desencriptar el número de teléfono
        const decryptedPhoneNumber = decryptPhoneNumber(user.numero_telefonico, process.env.ACCESS_TOKEN_SECRET)

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          nombres: user.nombres,
          estado: user.estado,
          apellidos: user.apellidos,
          numero_documento: user.numero_documento,
          tipo_documento: user.tipo_documento,
          numero_telefonico: decryptedPhoneNumber,
        };
      });

    res.status(200).json({
      message: "Usuarios encontrados correctamente",
      code: 200,
      data: filteredUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};


exports.updateUserStatus = async (req, res) => {
  const userId = req.params.id;
  // Verificar el formato del ID del usuario
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(200)
      .json({ message: "ID de usuario inválido", code: 400 });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { estado: true });

    if (!user) {
      return res
        .status(200)
        .json({ message: "Usuario no encontrado", code: 404 });
    }

    res.json({
      message: "Felicitacines Cuenta verificada correctamente",
      code: 200,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      message: "Error al actualizar el estado del usuario",
      code: 500,
    });
  }
};

// actualizar datos usuario
exports.updateUser = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      nombres,
      apellidos,
      numero_documento,
      tipo_documento,
      numero_telefonico,
      role,
      estado,
    } = req.body;

    console.log("entra en actualizar ",req.body);
    // Buscar el usuario existente
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los campos proporcionados
    user.username = username;
    user.email = email;
    user.nombres = nombres;
    user.apellidos = apellidos;
    user.numero_documento = numero_documento;
    user.tipo_documento = tipo_documento;
    user.estado = estado;

    // Encriptar el número de teléfono si se proporciona
    if (numero_telefonico) {
      const hashedPhoneNumber = encryptPhoneNumber(
        numero_telefonico,
        process.env.ACCESS_TOKEN_SECRET
      );
      user.numero_telefonico = hashedPhoneNumber;
    }

    // Encriptar la contraseña si se proporciona
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    // Verificar si se ha proporcionado un rol válido
    if (role) {
      const existingRole = await Role.findOne({ name: role });
      if (!existingRole) {
        return res
          .status(400)
          .json({ message: "El rol proporcionado no es válido" });
      }
      user.role = existingRole._id;
    }
console.log("el usuario a actualizar",user);
    await user.save();
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      code: 200,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};



// Controlador para eliminar un usuario ocultarlo
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(200)
        .json({ message: "Usuario no encontrado", code: 404 });
    }

    user.estado = false;
    await user.save();

    res
      .status(200)
      .json({
        message: "Usuario marcada como inactiva correctamente",
        code: 200,
      });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(200)
        .json({ message: "ID de Usuario inválido", code: 400 });
    }
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener propiedad en base de datos",
        code: 500,
      });
  }
};


// Eliminar varios usuarios
exports.deleteMultipleUsuarios = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validar que los IDs sean válidos
    const isValidIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!isValidIds) {
      return res.status(400).json({ message: "IDs inválidos", code: 400 });
    }

    const updatePromises = ids.map((id) =>
    User.findByIdAndUpdate(id, { estado: false })
    );

    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "Usuarios actualizados correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar Usuarios", code: 500 });
  }
};