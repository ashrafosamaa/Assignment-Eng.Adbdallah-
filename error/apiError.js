var baseError = require('../error/baseError');

class apiError extends baseError{
    constructor(name,httpStatusCode,description,isOperational) {
        super(name,httpStatusCode,description,isOperational);
    }
}

module.exports = apiError;