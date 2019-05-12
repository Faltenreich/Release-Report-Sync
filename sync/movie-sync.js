const Parse = require('parse/node')
const Genre = Parse.Object.extend("Genre")
const Release = Parse.Object.extend("Release")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Merger = include('data/parser/merge')

const Networking = include('networking/networking')
const MovieDbApi = include('networking/api/moviedb')

module.exports = {
    start:async function(language, date) {
        await syncGenres(language)
        console.log("Synced movie genres completely")
        await syncReleases(language, date, 1)
        console.log("Synced movie releases completely")
    }
}

async function syncGenres(language) {
    const request = MovieDbApi.genres(language)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto.genres, ID_PREFIX_MOVIEDB, Genre, function() { return new Genre() }, function(dto, entity) { Merger.mergeMovieGenre(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced movie genres: page 1 of 1`)
}

function loadReleases() {
    const dto = require('./assets/moviedb/discover.json');
    handleMovieFromDto(1, 1, dto)
}

async function syncReleases(language, date, page) {
    const request = MovieDbApi.discover(language, date, page)
    const dto = await Networking.sendRequest(request)
    const pageCount = dto.total_pages
    const entities = await DtoParser.parseEntitiesFromDto(dto.results, ID_PREFIX_MOVIEDB, Release, function() { return new Release() }, function(dto, entity) { Merger.mergeMovieRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced movie releases: page ${page} of ${pageCount}`)
    
    const loadMore = page < pageCount
    if (loadMore) {
        await syncReleases(language, date, page + 1)
    } else {
        return
    }
}