var express = require('express');
var router = express.Router();
var storeContrller=require('../controller/storeController');

router.get('/stores', storeContrller.getStoreList);
router.post('/stores/save',storeContrller.saveStore);

module.exports = router;