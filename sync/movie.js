const Database = include('data/database')
const ParseParser = include('data/parser/parse')
const Networking = include('networking/networking')
const MovieDbApi = include('networking/api/moviedb')

const Parse = require('parse/node')
const Genre = Parse.Object.extend("Genre")
const Release = Parse.Object.extend("Release")

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
    const dtos = dto.genres
    const externalIds = dtos.map(it => ID_PREFIX_MOVIEDB + it.id)
    const entities = await Database.getByExternalIds(externalIds, Genre)
    const promises = dtos.map(result => {
        const existing = entities.find(release => { return release.externalId == ID_PREFIX_MOVIEDB + result.id })
        const entity = existing != null ? existing : new Genre()
        ParseParser.mergeMovieGenre(result, entity)
        return entity
    })
    return await Promise.all(promises).then(async entities => {
        await Database.saveAll(entities)
    }).catch(error => {
        throw(error)
    })
}

function loadMovieReleasesFromJsonFile() {
    const dto = require('./assets/moviedb/discover.json');
    handleMovieFromDto(1, 1, dto)
}

async function loadMovieReleasesFromNetwork(language, year, page) {
    const request = MovieDbApi.discover(language, year, page)
    const dto = await Networking.sendRequest(request)
    const pageCount = dto.total_pages
    await handleMovieReleases(dto)
    console.log(`Movie releases page ${page} of ${pageCount}`)
    const loadMore = page < pageCount
    if (loadMore) {
        await loadMovieReleasesFromNetwork(language, year, page + 1)
    } else {
        return
    }
}

async function handleMovieReleases(dto) {
    const dtos = dto.results
    const externalIds = dtos.map(it => ID_PREFIX_MOVIEDB + it.id)
    const entities = await Database.getByExternalIds(externalIds, Release)
    const promises = dtos.map(result => {
        const existing = entities.find(release => { return release.externalId == ID_PREFIX_MOVIEDB + result.id })
        const entity = existing != null ? existing : new Release()
        ParseParser.mergeMovieRelease(result, entity)
        return entity
    })
    return await Promise.all(promises).then(async entities => {
        await Database.saveAll(entities)
    }).catch(error => {
        throw(error)
    })
}