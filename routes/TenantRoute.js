const TenantController = require('../controllers').Tenant;
const express = require('express');
const {adminMiddleware} = require('../middlewares');

let router = express.Router();

router.post("/", adminMiddleware, TenantController.createTenant);
router.post("/login", TenantController.login);
router.get("/:id", TenantController.detail);

module.exports = router;
