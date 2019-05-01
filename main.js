const Parse = require('parse/node')
const Sync = require('./sync')

Parse.Cloud.job("syncData", function (request, status) {
    Sync.start()
});