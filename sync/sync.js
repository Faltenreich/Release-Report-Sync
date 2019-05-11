const GameSync = include('sync/game')
const MovieSync = include('sync/movie')

module.exports = {
    start:async function() {
        const language = "en"
        const year = new Date().getFullYear()
        await GameSync.start(language, year)
        await MovieSync.start(language, year)
    }
}