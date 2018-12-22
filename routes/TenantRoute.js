const TenantController = require('../controllers').Tenant;
const express = require('express');
const {jsonMiddleware, adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/", jsonMiddleware, adminMiddleware, TenantController.createTenant);
router.post("/login", jsonMiddleware, TenantController.login);
router.get("/:id", TenantController.detail);

module.exports = router;
