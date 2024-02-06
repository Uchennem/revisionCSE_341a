const express = require('express');
const router = express.Router();

const homecontroller = require('../controllers/homeController.js');

router.get("/sarah", homecontroller)

module.exports = router