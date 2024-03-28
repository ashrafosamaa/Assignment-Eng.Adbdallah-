var express = require('express');
var Router = express.Router();
var uploadController = require('../controller/uploadController');

Router.post('/upload/file', uploadController.uploadFile);

module.exports=Router;