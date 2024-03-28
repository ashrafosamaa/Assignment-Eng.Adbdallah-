var events = require('events');
var audit = require('../model/auditModel');
var queries = require('../db/query');
var dbConnection = require('../db/connection');



var emitter = new events.EventEmitter();

var auditEvent='audit';
emitter.on(auditEvent, function (audit) {
          console.log("Audit Event Emitter-Audit: "+JSON.stringify(audit));
    try {
        values=[audit.auditAction,JSON.stringify(audit.data),audit.status,audit.error,audit.auditBy,audit.auditOn];
        var auditQuery = queries.queryList.AUDIT_QUERY;
        dbConnection.dbQuery(auditQuery, values);
    } catch (error) {
        console.log("Audit Event Emitter - error: " + error);
    }
});

exports.prepareAudit = function (auditAction,data,error,auditBy,auditOn) {
    let status = 200;
    if (error)
        status=500;
    let auditObj=new audit.Audit(auditAction,data,status,error,auditBy,auditOn);
    emitter.emit(auditEvent, auditObj);
}

