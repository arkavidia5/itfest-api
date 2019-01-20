const AdminController = require('../controllers').Admin;
const express = require('express');

let router = express.Router();

router.post("/login", AdminController.login, async function (req, res) {
    if (req.validated) {
        res.setHeader('authorization', `Bearer ${req.token}`);
        res.json('OK');
    } else {
        res.status(401).json('Not authorized');
    }
});

module.exports = router;
