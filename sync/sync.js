const GameSync = include('sync/game-sync')
const MovieSync = include('sync/movie-sync')
const MusicSync = include('sync/music-sync')
const Standardization = include('data/transform/standardization')

module.exports = {
    start:async function() {
        const language = "en"
        const region = "de"
        const minDate = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(minDate.getFullYear() + 2)

        await MovieSync.start(language, region, minDate, maxDate)
        await MusicSync.start()
        await GameSync.start(language, minDate, maxDate)
    }
}