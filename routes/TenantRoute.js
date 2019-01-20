const TenantController = require('../controllers').Tenant;
const express = require('express');
const {jsonMiddleware, adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/", jsonMiddleware, adminMiddleware, TenantController.createTenant, async function (req, res) {
    res.json('OK');
});
router.post("/login", jsonMiddleware, TenantController.login, async function (req, res) {
    if (req.token) {
        res.setHeader('authorization', `Bearer ${req.token}`);
        res.json('OK');
    } else {
        res.status(401).json('not authorized');
    }
});
router.get("/all", TenantController.getAllTenant, async function (req, res) {
    res.json(req.tenants);
});
router.get("/:name", TenantController.detail, async function (req, res) {
    res.json(req.tenant);
});

module.exports = router;
