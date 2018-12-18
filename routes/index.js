let express = require('express');
let route = express.Router();

route.use('/user', require('./UserRoute'));
route.use('/admin', require('./AdminRoute'));
route.use('/tenant', require('./TenantRoute'));
route.use('/item', require('./ItemRoute'));
route.use("/transaction", require('./TransactionRoute'));

module.exports = route;
