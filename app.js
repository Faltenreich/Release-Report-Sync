global.include = function(file) {
    const path = __dirname + '/' + file
    return require(path);
}

const Parse = require('parse/node')
const Sync = include('api/sync')
const Transformer = include('data/transform/transformer')

module.exports = {
    start:function() {
        Parse.initialize("La20z4nOXJhy9FpOfJAsA4M4ucfsns6D1USzjXBj", "h3gPdratMkStBrUA4Qqu5mD2PqBl8N8xjcxqxA26")
        Parse.serverURL = "https://parseapi.back4app.com"
        Parse.masterKey = "2qDZgfVmxfGwmK06qilGiojNasnow2CO8vixdCxx"
        
        const language = "en"
        const region = "de"
        const minDate = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(minDate.getFullYear() + 2)

        //Sync.start(language, region, minDate, maxDate)
        Transformer.start(language, region, minDate, maxDate)
    }
}