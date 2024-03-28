var express = require('express');
var Router = express.Router();
var userController=require('../controller/userController');

Router.get('/users', userController.getUserList);
Router.post('/users/save', userController.saveUser);

module.exports = Router;
