const Parse = require('parse/node')
const Genre = Parse.Object.extend("Genre")
const Release = Parse.Object.extend("Release")

const BaseUtils = include('util/base')
const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('networking/mapper/movie')

const Networking = include('networking/networking')
const MovieDbApi = include('networking/api/moviedb')

const REQUEST_DELAY_IN_MILLIS = 250

module.exports = {
    start:async function(language, date) {
        await syncGenres(language)
        console.log("Synced movie genres completely")

        const minDate = date
        const maxDate = new Date()
        maxDate.setFullYear(minDate.getFullYear() + 2)
        await syncReleases(language, minDate, maxDate, 1)
        console.log("Synced movie releases completely")
    }
}

async function syncGenres(language) {
    const request = MovieDbApi.genres(language)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto.genres, ID_PREFIX_MOVIEDB, Genre, function() { return new Genre() }, function(dto, entity) { Mapper.mapGenre(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced movie genres: page 1 of 1`)
}

function loadReleases() {
    const dto = require('./assets/moviedb/discover.json');
    handleMovieFromDto(1, 1, dto)
}

async function syncReleases(language, minDate, maxDate, page) {
    const request = MovieDbApi.discover(language, minDate, maxDate, page)
    const dto = await Networking.sendRequest(request)
    const pageCount = dto.total_pages
    const entities = await DtoParser.parseEntitiesFromDto(dto.results, ID_PREFIX_MOVIEDB, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced movie releases: page ${page} of ${pageCount}`)
    
    await BaseUtils.sleep(REQUEST_DELAY_IN_MILLIS)

    const loadMore = page < pageCount
    if (loadMore) {
        await syncReleases(language, minDate, maxDate, page + 1)
    } else {
        return
    }
}