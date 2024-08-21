const express = require('express');
const router = express.Router();
const {handleLogin, handleLogout, handleRegister, handleRefresh} = require('../controllers/auth.controller');

router.post('/login', handleLogin)

router.post('/register', handleRegister);

router.post('/logout', handleLogout)

router.post('/refresh', handleRefresh)

module.exports = router;

