const express = require('express');
const router = express.Router();
const {createRole, getRoles, getRoleById, updateRole, deleteRole} = require('../controllers/role.controller');

router.get('/role', getRoles);
router.post('/role', createRole);
router.get('/role/:id', getRoleById);
router.put('/role/:id', updateRole);
router.delete('/role/:id', deleteRole);

module.exports = router;
