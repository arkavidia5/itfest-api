const DashboardController = require('../controllers').Dashboard;
const express = require('express');
const redirectIfNotAdmin = require('../middlewares').redirectIfNotAdmin;

let router = express.Router();

router.get("/user", redirectIfNotAdmin, async function (req, res) {
    res.render('user', {title: 'User'});
});
router.get("/item", redirectIfNotAdmin, async function (req, res) {
    res.render('item', {title: 'Item'});
});
router.get("/tenant", redirectIfNotAdmin, async function (req, res) {
    res.render('tenant', {title: 'Tenant'});
});
router.get("/transaction", redirectIfNotAdmin, async function (req, res) {
    res.render('transaction', {title: 'Transaction'});
});
router.get("/login", async function (req, res) {
    res.render('login', {title: 'Login'});
});
router.post("/login", DashboardController.login, async function (req, res) {
    res.redirect("/dashboard/user");
});

module.exports = router;
