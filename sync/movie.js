const Database = include('data/database')
const ParseParser = include('data/parser/parse')
const Networking = include('networking/networking')
const MovieDbApi = include('networking/api/moviedb')

module.exports = {
    start:async function(language, year) {
        await loadMovieGenresFromNetwork(language)
        console.log("Movie genres completed")
        await loadMovieReleasesFromNetwork(language, year, 1)
        console.log("Movie releases completed")
    }
}

async function loadMovieGenresFromNetwork(language) {
    const request = MovieDbApi.genres(language)
    const dto = await Networking.sendRequest(request)
    await handleMovieGenres(dto)
    console.log(`Movie genres page 1 of 1`)
}

async function handleMovieGenres(dto) {
    const promises = dto.genres.map(async result => { return await handleMovieGenre(result) })
    return await Promise.all(promises).then(async genres => {
        await Database.saveAll(genres)
    }).catch(error => {
        throw(error)
    })
}

async function handleMovieGenre(dto) {
    return await ParseParser.parseMovieGenreFromDto(dto)
}

function loadMovieReleasesFromJsonFile() {
    const dto = require('./assets/moviedb/discover.json');
    handleMovieFromDto(1, 1, dto)
}

async function loadMovieReleasesFromNetwork(language, year, page) {
    const request = MovieDbApi.discover(language, year, page)
    const dto = await Networking.sendRequest(request)
    const pageCount = dto.total_pages
    await handleMoviePage(dto)
    console.log(`Movie releases page ${page} of ${pageCount}`)
    const loadMore = page < pageCount
    if (loadMore) {
        await loadMovieReleasesFromNetwork(language, year, page + 1)
    } else {
        return
    }
}

async function handleMoviePage(dto) {
    const promises = dto.results.map(async result => { return await ParseParser.parseMovieReleaseFromDto(result) })
    return await Promise.all(promises).then(async movies => {
        await Database.saveAll(movies)
    }).catch(error => {
        throw(error)
    })
}