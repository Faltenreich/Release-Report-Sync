global.include = function(file) {
    const path = __dirname + '/' + file
    return require(path);
}

const Parse = require('parse/node')
const Sync = include('api/sync')
const Transformer = include('data/transform/transformer')
const Config = require('./config.json')

module.exports = {
    start:async function() {
        try {
            config()

            const language = "en"
            const region = "de"
            const minDate = new Date()
            const maxDate = new Date()
            maxDate.setFullYear(minDate.getFullYear() + 2)
    
            await Sync.start(language, region, minDate, maxDate)
            await Transformer.start(language, region, minDate, maxDate)
        } catch (error) {
            console.error(error)
        }
    }
}

function config() {
    const parseServerSettings = Config.parseServer
    const serverUrl = parseServerSettings.serverUrl
    const applicationId = parseServerSettings.applicationId
    const javascriptKey = parseServerSettings.javascriptKey
    const masterKey = parseServerSettings.masterKey

    Parse.initialize(applicationId, javascriptKey)
    Parse.serverURL = serverUrl
    Parse.masterKey = masterKey
}