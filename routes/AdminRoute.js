const AdminController = require('../controllers').Admin;
const express = require('express');

let router = express.Router();

router.post("/login", AdminController.login);

module.exports = router;
