const App = require('./app')

Parse.Cloud.job("syncData", async (request) => {
    App.start()
});