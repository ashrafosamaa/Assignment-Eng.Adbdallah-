var express = require('express');
var Router = express.Router();
var exportController = require('../controller/exportController');

Router.get('/export/books', exportController.exportBooks);

module.exports = Router;