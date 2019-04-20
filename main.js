const Parse = require('parse/node')

Parse.Cloud.job("syncData", function (request, status) {
    start()
});