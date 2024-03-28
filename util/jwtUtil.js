var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.generateToken = (userId,username,email,full_name,userRoles,user_type_code) => {
    var token = jwt.sign({
        userId: userId,
        username: username,
        email: email,
        full_name:full_name,
        roles: userRoles,
        user_type:user_type_code
    }, process.env.SECRET, { expiresIn: "3d" })
    return token;
};


exports.verifyToken = function (roles) {
    return async (req, res, next) => {
        try {
            const { token } = req.headers;
            console.log("Token :" + token);
            if (!token) {
                console.log("no token exists");
                return res.status(500).send("Token is not exist");
            };

            var decode = jwt.verify(token, process.env.SECRET);
            console.log("decode :" +JSON.stringify(decode));
            req.user = {
                userId: decode.userId,
                username: decode.username,
                email: decode.email,
                full_name: decode.full_name,
                roles: decode.roles,
                user_type: roles.user_type
            };

            console.log("Roles :" + roles);
            if (!this.hasRole(roles,decode.roles)) {
                console.log("Error : not have the same role");
                return res.status(401).send({ error: "Authentication Failed" });
            }
            
            console.log("Valid Token");
            next();

        } catch (error) {
            next(error);
        }

    }
};


exports.hasRole = function (routeRoles,userRoles){
    console.log("routeRoles :" + routeRoles.includes("user"));
    let result = false;
    userRoles.forEach(role => {
        if (routeRoles.includes(role)) {
            result = true;
            return;
        }
    });
    return result;
};