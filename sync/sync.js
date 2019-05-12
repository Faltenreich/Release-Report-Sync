const GameSync = include('sync/game-sync')
const MovieSync = include('sync/movie-sync')

module.exports = {
    start:async function() {
        const language = "en"
        const year = new Date().getFullYear()
        // await MovieSync.start(language, year)
        await GameSync.start(language, year)
    }
}