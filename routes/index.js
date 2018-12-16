let express = require('express');
let route = express.Router();

route.use('/user', require('./UserRoute'));


module.exports = route;
