const GameSync = include('api/igdb/sync')
const MovieSync = include('api/moviedb/sync')
const MusicSync = include('api/discogs/sync')

module.exports = {
    start:async function() {
        console.log(`Starting synchronization`)
        const language = "en"
        const region = "de"
        const minDate = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(minDate.getFullYear() + 2)

        await GameSync.start(language, minDate, maxDate)
        await MovieSync.start(language, region, minDate, maxDate)
        // TODO: Find music api that supports popularity
        // await MusicSync.start(minDate.getFullYear(), maxDate.getFullYear())
        console.log(`Completed synchronization`)
    }
}