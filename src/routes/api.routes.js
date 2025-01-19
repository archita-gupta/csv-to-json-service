const express = require('express');
const controllers = require('../controllers/api.controller');
const router = express.Router();

// Routes definition
router.use('/convert-to-json', controllers);


module.exports = router; 