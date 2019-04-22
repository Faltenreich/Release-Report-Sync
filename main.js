const Parse = require('parse/node')
const Application = require('./app')

Parse.Cloud.job("syncData", function (request, status) {
    Application.start()
});