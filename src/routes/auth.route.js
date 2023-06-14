const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, updateUserStatus, updateUser, deleteUser, deleteMultipleUsuarios } = require('../controllers/auth.controller');

// Rutas para autenticación
router.post('/user/signup', signup);
router.post('/user/login', login);
router.get('/users', getAllUsers);
router.get('/users/active/:id', updateUserStatus);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post('/users/delete-multiple', deleteMultipleUsuarios);

module.exports = router;
