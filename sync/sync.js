const GameSync = include('sync/game-sync')
const MovieSync = include('sync/movie-sync')
const MusicSync = include('sync/music-sync')
const Standardization = include('data/transform/standardization')

module.exports = {
    start:async function() {
        const language = "en"
        const date = new Date()
        await MovieSync.start(language, date)
        await MusicSync.start()
        await GameSync.start(language, date)
    }
}