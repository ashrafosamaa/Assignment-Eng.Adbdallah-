var queries = require('../db/query');
var dbConnection = require('../db/connection');
var util = require('../util/utility');

exports.getStoreList = async(req, res) => {
    try {
        var storeListQuery = queries.queryList.GET_STORE_LIST_QUERY;
        var result =await dbConnection.dbQuery(storeListQuery);
        return res.status(200).send(JSON.stringify(result.rows));
    }
    catch (err) { 
        console.log("Error: " + err);
        return res.status(500).send({ error : 'Failed to get store list' });
    }
};

exports.saveStore = async(req, res) => {
    try {
        var createdBy = "admin";
        var createdOn = new Date();

        var storeName = req.body.storeName;
        var address= req.body.address;
        console.log("storeName:" + storeName + "........ address :" + address);
        if (!storeName || !address) {
            return res.status(500).send({error :'storeName and address are required and cannot be empty'});
        }

        let storeCode = util.generateStoreCode();
        
        values = [storeName, storeCode, address,createdBy,createdOn];
        var saveStoreQuery = queries.queryList.SAVE_STORE_QUERY;
        await dbConnection.dbQuery(saveStoreQuery, values);
        return res.status(201).send('Store saved successfully' );
    }
    catch (err) {
        console.log("Error : "+ err);
        return res.status(500).send({ error :'Failed to save store' });
    }
};