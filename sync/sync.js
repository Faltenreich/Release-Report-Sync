const GameSync = include('sync/game-sync')
const MovieSync = include('sync/movie-sync')
const MusicSync = include('sync/music-sync')

module.exports = {
    start:async function() {
        const language = "en"
        const date = new Date()
        //await GameSync.start(language, date)
        //await MovieSync.start(language, date)
        await MusicSync.start()
    }
}