const GameSync = include('sync/game-sync')
const MovieSync = include('sync/movie-sync')

module.exports = {
    start:async function() {
        const language = "en"
        const date = new Date()
        // await MovieSync.start(language, date)
        await GameSync.start(language, date)
    }
}