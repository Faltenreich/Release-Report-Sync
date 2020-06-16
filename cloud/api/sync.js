const GameSync = include('api/igdb/sync')
const MovieSync = include('api/moviedb/sync')
const MusicSync = include('api/discogs/sync')

module.exports = {
    start:async function(language, region, minDate, maxDate) {
        console.log(`Starting synchronization`)
        await GameSync.start(language, minDate, maxDate)
        await MovieSync.start(language, region, minDate, maxDate)
        // TODO: Find music api that supports popularity
        // await MusicSync.start(minDate.getFullYear(), maxDate.getFullYear())
        console.log(`Completed synchronization`)
    }
}