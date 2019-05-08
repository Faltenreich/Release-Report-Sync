const GameSync = require('./sync/game')
const MovieSync = require('./sync/movie')

module.exports = {
    start:function() {
        const language = "en"
        const year = new Date().getFullYear()
        // GameSync.start(language, year)
        MovieSync.start(language, year)
    }
}