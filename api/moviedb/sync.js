const Parse = require('parse/node')
const Genre = Parse.Object.extend("Genre")
const Release = Parse.Object.extend("Release")

const BaseUtils = include('util/base')
const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('api/moviedb/mapper')

const Networking = include('networking/networking')
const MovieDbApi = include('api/moviedb/api')

const REQUEST_DELAY_IN_MILLIS = 250

module.exports = {
    start:async function(language, region, minDate, maxDate) {
        await syncGenres(language)
        console.log("Synced movie genres completely")
        await syncReleases(language, region, minDate, maxDate, 1)
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

async function syncReleases(language, region, minDate, maxDate, page, popularityFactor) {
    const request = MovieDbApi.discover(language, region, minDate, maxDate, page)
    const dto = await Networking.sendRequest(request)

    if (popularityFactor == null && dto.results.length > 0) {
        popularityFactor = 100/ dto.results[0].popularity
    }

    const pageCount = dto.total_pages
    const entities = await DtoParser.parseEntitiesFromDto(dto.results, ID_PREFIX_MOVIEDB, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity, popularityFactor) })
    await Database.saveAll(entities)
    console.log(`Synced movie releases: page ${page} of ${pageCount}`)
    
    await BaseUtils.sleep(REQUEST_DELAY_IN_MILLIS)

    const loadMore = page < pageCount
    if (loadMore) {
        await syncReleases(language, region, minDate, maxDate, page + 1, popularityFactor)
    } else {
        return
    }
}