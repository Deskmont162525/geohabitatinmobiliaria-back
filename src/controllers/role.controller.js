const Role = require("../models/role.model");

// Controlador para crear un nuevo rol
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Verificar si el rol ya existe
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(200).json({ message: "El rol ya existe", code: 409 });
    }

    // Crear el nuevo rol
    const role = new Role({ name, permissions });

    await role.save();
    res.status(201).json({ message: "Rol creado correctamente", code: 201 });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al crear rol", code: 500 });
  }
};

// Controlador para obtener todos los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      message: "Usuario creado ok",
      code: 201,
      data: roles,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al obtener roles", code: 500 });
  }
};

// Controlador para obtener un rol por su ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(200).json({ message: "Rol no encontrado", code: 404 });
    }
    res.status(200).json({
      message: "Usuario creado ok",
      code: 200,
      data: role,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al obtener rol", code: 500 });
  }
};

// Controlador para actualizar un rol
exports.updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(200).json({ message: "Rol no encontrado", code: 404 });
    }

    role.name = name;
    role.permissions = permissions;
    await role.save();

    res
      .status(200)
      .json({ message: "Rol actualizado correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al actualizar rol", code: 500 });
  }
};

// Controlador para eliminar un rol
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(200).json({ message: "Rol no encontrado", code: 404 });
    }

    await role.deleteOne();
    res.status(200).json({ message: "Rol eliminado correctamente", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al eliminar rol", code: 500 });
  }
};
