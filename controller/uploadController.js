var Logger = require('../services/loggerService');
const multer  = require('multer');

const logger = new Logger('uploadController');

exports.uploadFile = async (req, res) => {
    try {
        const upload = multer({ dest: process.env.UPLOAD_PATH }).single("photo");
        upload(req, res, next => {
            try {
                var path = req.file.path;
                var file = req.file;
                console.log("Path: " + path);
                console.log("File: " + JSON.stringify(file));
                return res.status(200).send({ data: "File is uploaded successfully." });
            } catch (e) {  
                throw e;
            }

        });
        
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).send({ error: "Failed to upload file" });
    }
};