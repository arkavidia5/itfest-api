let express = require("express");
let route = express.Router();

route.use("/user", require("./UserRoute"));
route.use("/login", require("./AdminRoute"));
route.use("/tenant", require("./TenantRoute"));
route.use("/item", require("./ItemRoute"));
route.use("/transaction", require("./TransactionRoute"));
route.get("/docs", async function(req, res) {
  let info = require("../docs");
  res.json(info);
});

module.exports = route;
