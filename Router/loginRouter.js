var express = require('express');
const Router = express.Router();
var loginController = require('../controller/loginController');
var jwtUtil = require('../util/jwtUtil');

Router.get('/login/profile/:userId',jwtUtil.verifyToken(['user']), loginController.getUserProfile);
Router.post('/login/signIn', loginController.signIn);

module.exports=Router;