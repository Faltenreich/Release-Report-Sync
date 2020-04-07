global.include = function(file) {
    const path = __dirname + '/' + file
    return require(path);
}

const Parse = require('parse/node')
const Sync = include('api/sync')
const Transformer = include('data/transform/transformer')
const Config = include('config')

module.exports = {
    start:async function() {
        try {
            const config = Config.parseServer        
            Parse.initialize(config.applicationId, config.javascriptKey)
            Parse.serverURL = config.serverUrl
            Parse.masterKey = config.masterKey

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