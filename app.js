global.include = function(file) {
    const path = __dirname + '/' + file
    return require(path);
}

const Parse = require('parse/node')
const Sync = include('api/sync')
const Transformer = include('data/transform/transformer')

module.exports = {
    start:async function() {
        config()
        
        const language = "en"
        const region = "de"
        const minDate = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(minDate.getFullYear() + 2)

        await Sync.start(language, region, minDate, maxDate)
        await Transformer.start(language, region, minDate, maxDate)
    }
}

function config() {
    const serverUrl = ""
    const applicationId = ""
    const javascriptKey = ""
    const masterKey = ""
    
    Parse.initialize(applicationId, javascriptKey)
    Parse.serverURL = serverUrl
    Parse.masterKey = masterKey
}