var queries = require('../db/query');
var dbConnection = require('../db/connection');
var util = require('../util/utility');
var utilValidation= require('../util/validation');
var Logger = require('../services/loggerService');
var auditService = require('../audit/auditService');
var auditAction = require('../audit/auditAction');
var bcrypt = require('bcryptjs');

const logger = new Logger('userController');


exports.getUserList = async (req, res) => {
        var auditOn=util.dateFormat();
    try {
        var userListQuery = queries.queryList.GET_USER_LIST_QUERY;
        var result = await dbConnection.dbQuery(userListQuery);
        logger.info('return user list', result.rows);
        auditService.prepareAudit(auditAction.actionList.GET_USER_LIST,result.rows,null,"postman",auditOn)
        return res.status(200).send(JSON.stringify(result.rows));
    } catch (err) {
        console.log("Error : " + err);
        let errorMessage = "Failed to get User list : " + err;
        auditService.prepareAudit(auditAction.actionList.GET_USER_LIST,null,errorMessage,'postman',auditOn);
        return res.status(500).send({ error: "Failed to get user list" });
    }
};

exports.saveUser = async (req, res) => {
    try {
        var createdBy = "Admin";
        var createdOn = new Date();
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var full_name = req.body.full_name;
        var user_type_code = req.body.user_type_code;
        var groups = req.body.groups;

        if (!username || !password || !email || !full_name || !user_type_code || !groups) {
            return res.status(500).send({ error: "username,password,email,full_name,user_type_code,groups con not be empty" });
        }

        var isUserExistQuery = queries.queryList.IS_USER_EXIST_QUERY;
        var result = await dbConnection.dbQuery(isUserExistQuery, [username, email]);
        console.log("Result: " + JSON.stringify(result))
        if (result.rows[0].count != "0") { 
             return res.status(500).send({ error: " User already exists" });
        }

        if (!utilValidation.isValidEmail(email)) {
             return res.status(500).send({ error: "Email is not valid " });
        }

        if (!utilValidation.isValidPassword(password)) {
            return res.status(500).send({ error: "Password is not valid " });
        }

        var hashedPassword=await bcrypt.hash(password,10);

        values=[username,hashedPassword, email, full_name, user_type_code,createdOn,createdBy];
        var saveUserQuery = queries.queryList.SAVE_USER_QUERY;
        await dbConnection.dbQuery(saveUserQuery,values);
         return res.status(201).send("Successfully add new user");
    } catch (err) { 
        console.log("Error : " + err);
         return res.status(500).send({ error: "Failed to add new user" });
    }
    
};