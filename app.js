global.include = function(file) {
    const path = __dirname + '/' + file
    return require(path);
}

const Parse = require('parse/node')
const Sync = include('api/sync')

module.exports = {
    start:function() {
        Parse.initialize("La20z4nOXJhy9FpOfJAsA4M4ucfsns6D1USzjXBj", "h3gPdratMkStBrUA4Qqu5mD2PqBl8N8xjcxqxA26")
        Parse.serverURL = "https://parseapi.back4app.com"
        Sync.start()
    }
}