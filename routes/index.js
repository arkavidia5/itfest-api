let express = require("express");
let route = express.Router();
let routeAPI = express.Router();

routeAPI.use("/user", require("./UserRoute"));
routeAPI.use("/admin", require("./AdminRoute"));
routeAPI.use("/tenant", require("./TenantRoute"));
routeAPI.use("/item", require("./ItemRoute"));
routeAPI.use("/transaction", require("./TransactionRoute"));
routeAPI.get("/docs", async function (req, res) {
    let info = require("../docs");
    res.json(info);
});
route.use("/api", routeAPI);
route.use("/dashboard", require("./DashboardRoute"));

module.exports = route;
