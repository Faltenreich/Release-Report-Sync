const Parse = require('parse/node')
const App = require('./app')

start()

function start() {
    Parse.initialize("La20z4nOXJhy9FpOfJAsA4M4ucfsns6D1USzjXBj", "h3gPdratMkStBrUA4Qqu5mD2PqBl8N8xjcxqxA26")
    Parse.serverURL = "https://parseapi.back4app.com"
    App.start()
}