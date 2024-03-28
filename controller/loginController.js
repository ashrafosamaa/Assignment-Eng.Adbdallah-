var queries = require("../db/query");
var dbConnection = require("../db/connection");
var util = require("../util/utility");
var jwtUtil = require("../util/jwtUtil");
var utilValidation = require("../util/validation");
var Logger = require("../services/loggerService");
var auditService = require("../audit/auditService");
var auditAction = require("../audit/auditAction");
var errorStatus = require("../error/errorStatus");
var bcrypt = require("bcryptjs");

const logger = new Logger("userController");

exports.getUserProfile = async (req, res) => {
  var user = req.user;
  try {
    return res.status(200).send(JSON.stringify(user));
  } catch (err) {
    console.log("Error : " + err);
    return res.status(500).send({ error: "Failed to get user" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    //1.validate is not empty
    //2.get user by username
    //3.compare password
    //4.get user roles
    //5.generate token
    if (!username || !password) {
      return res
        .status(500)
        .send({ error: "username and password can not be empty" });
    }

    var loginQuery = queries.queryList.LOGIN_QUERY;
    var result = await dbConnection.dbQuery(loginQuery, [username]);
    var dbResponse = result.rows[0];
    if (dbResponse == null) {
      logger.info("User : [" + username + "] not exist in database");
      return res
        .status(errorStatus.unauthorized)
        .send({ error: "Invalid username or Invalid password" });
    }

    var isValidPassword = utilValidation.comparePassword(
      password,
      dbResponse.password
    );
    if (!isValidPassword) {
      logger.info("Invalid password");
      return res
        .status(errorStatus.unauthorized)
        .send({ error: "Invalid username or Invalid password" });
    }

    var userRoles = await this.getUserRoles(dbResponse.user_id, req, res);
    console.log("UserRoles : " + JSON.stringify(userRoles));

    var token = jwtUtil.generateToken(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.full_name,
      userRoles,
      dbResponse.user_type_code
    );
    return res.status(200).send(JSON.stringify(token));
  } catch (err) {
    logger.error("Failed to signIn,Invalid username or Invalid password" + err);
    return res
      .status(500)
      .send({ error: "Failed to signIn,Invalid username or Invalid password" });
  }
};

exports.getUserRoles = async (userId) => {
  try {
    let roles = ["user", "admin"];
    return roles;
  } catch (err) {}
};
