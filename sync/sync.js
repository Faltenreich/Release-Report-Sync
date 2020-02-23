const GameSync = include('sync/game-sync')
const MovieSync = include('sync/movie-sync')
const MusicSync = include('sync/music-sync')

module.exports = {
    start:async function() {
        const language = "en"
        const region = "de"
        const minDate = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(minDate.getFullYear() + 2)

        await GameSync.start(language, minDate, maxDate)
        await MovieSync.start(language, region, minDate, maxDate)
        // TODO: Find music api that supports popularity
        // await MusicSync.start(minDate.getFullYear(), maxDate.getFullYear())
    }
}