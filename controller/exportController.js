var queries = require('../db/query');
var dbConnection = require('../db/connection');
var Logger = require('../services/loggerService');
var fastCsv = require('fast-csv');
var fs = require('fs');
var ws = fs.createWriteStream("books.csv");

const logger = new Logger('exportController');

exports.exportBooks = async (req, res) => {
    try {
        var bookListQuery = queries.queryList.GET_BOOK_LIST_QUERY;
        var result = await dbConnection.dbQuery(bookListQuery);
        logger.info(" return book list ", result.rows);
        var data = JSON.parse(JSON.stringify(result.rows));
        fastCsv.write(data, { headers: true }).on('end', () => {
            console.log("Write to books.csv successfully");
            res.download("books.csv", function () {
                console.log("File downloaded successfully"); 
            });
        }).pipe(ws);
        // return res.status(200).send({ data: "export data successfully" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).send({ error: "Failed to export books" });
    }
};