var queries = require('../db/query');
var dbConnection = require('../db/connection');
var Logger = require('../services/loggerService');
var auditAction =require('../audit/auditAction');
var auditService = require('../audit/auditService');
var util = require('../util/utility');
var errorStatus = require('../error/errorStatus');
var apiError = require('../error/apiError');
// var errorType = require('../error/errorType');

const logger=new Logger('bookController');

exports.getBookList = async (req, res) => {
    var auditOn=util.dateFormat();
    try {
        var bookListQuery = queries.queryList.GET_BOOK_LIST_QUERY;
        var result = await dbConnection.dbQuery(bookListQuery);
        logger.info("return Book List", result.rows);
        auditService.prepareAudit(auditAction.actionList.GET_BOOK_LIST,result.rows,null,"postman",auditOn);
        return res.status(200).send(JSON.stringify(result.rows));
    } catch (err) {
        let errorMessage='Failed to get book list'+err;
        console.log("Error :" + err);
        auditService.prepareAudit(auditAction.actionList.GET_BOOK_LIST,null,JSON.stringify(errorMessage),"postman",auditOn);
        return res.status(500).send({ error: "Failed to get books " });
    }
};


exports.getBookDetails = async (req, res) => { 
    try {
        var bookId = req.params.bookId;
        console.log("Book Id :" + bookId);
        if (isNaN(bookId)) {
            throw new apiError("invalid bookId , is not a number",
                errorStatus.INTERNAL_SERVER_ERROR,
                "invalid bookId , is not a number, bookId value is : " + bookId,
                true);
        }
        var bookDetailsQuery = queries.queryList.GET_BOOK_DETAILS_QUERY;
        var result = await dbConnection.dbQuery(bookDetailsQuery, [bookId]);
        return res.status(200).send(JSON.stringify(result.rows[0]));
    } catch (err) {
        console.log("Error :" + err.description);
        // if (err.name === errorType.SQL_INJECTION_ERROR)
        //     //handlerError();
        logger.error("Failed to get book list" + JSON.stringify(err));
        return res.status(500).send({ error: "Failed to get book details" });
     }
};


exports.saveBook = async (req, res) => { 
    try {
        var createdBy = "admin";
        var createdOn = new Date();
        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var publisher = req.body.publisher;
        var pages = req.body.pages;
        var storeCode = req.body.storeCode;
        if (!title || !description || !author || !publisher || !pages || !storeCode) {
            return res.status(500).send("title,description,author,publisher,pages,storeCode are required and can not be empty");
        }
        values = [title, description, author, publisher, pages, storeCode, createdBy, createdOn];
        var saveBookQuery = queries.queryList.SAVE_BOOK_QUERY;
        await dbConnection.dbQuery(saveBookQuery,values);
        return res.status(201).send('successfully adding new book');
    } catch (err) { 
        console.log("Error :" + err);
        return res.status(500).send({ error: "Failed to get book details" });
    }
};


exports.updateBook = async (req, res) => { 
    try {
        var createdBy = "admin";
        var createdOn = new Date();
        var bookId = req.body.bookId;
        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var publisher = req.body.publisher;
        var pages = req.body.pages;
        var storeCode = req.body.storeCode;
        if (!title || !description || !author || !publisher || !pages || !storeCode) {
            return res.status(500).send("title,description,author,publisher,pages,storeCode are required and can not be empty");
        }
        values = [title, description, author, publisher, pages, storeCode, createdBy,createdOn,bookId];
        var updateBookQuery = queries.queryList.UPDATE_BOOK_QUERY;
        await dbConnection.dbQuery(updateBookQuery,values);
        return res.status(201).send( " Successfully update book title" +title);
    } catch (err) { 
        console.log("Error :" + err);
        return res.status(500).send({ error: "Failed to update book title" });
    }
};


exports.deleteBook = async (req, res) => { 
         var bookId = req.params.bookId;
    try {
        if (!bookId) {
            return res.status(500).send({error: "con not delete empty bookId"});
        }
        var deleteBookQuery = queries.queryList.DELETE_BOOK_QUERY;
        await dbConnection.dbQuery(deleteBookQuery,[bookId]);
        return res.status(201).send(" Successfully delete book ");
    } catch (err) { 
        console.log("Error :" + err);
        return res.status(500).send({ error: "Failed to delete book with id" });
    }
};