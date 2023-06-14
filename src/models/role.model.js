// Archivo role.model.js

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: { type: Array, required: true }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
