const Parse = require('parse/node')
const App = require('./app')

Parse.Cloud.job("syncData", function (request, status) {
    App.start()
});