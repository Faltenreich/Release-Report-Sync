const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Genre = Parse.Object.extend("Genre")
const Platform = Parse.Object.extend("Platform")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('networking/mapper/game')

const Networking = include('networking/networking')
const IgdbApi = include('networking/api/igdb')

// Free tier has an offset limit of 150 (see https://api-docs.igdb.com/#pagination)
const MAX_PAGE_COUNT = 150

module.exports = {
    // IGDB is currently not localized
    start:async function(language, date) {
        await syncGenres()
        console.log(`Synced game genres completely`)
        await syncPlatforms()
        console.log(`Synced game platforms completely`)
        await syncReleases(date, 0)
        console.log("Synced game releases completely")
    }
}

async function syncReleases(date, page) {
    const request = IgdbApi.games(date, page)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity) })
    await Database.saveAll(entities)
    const nextPage = page + 1
    console.log(`Synced game releases: page ${nextPage} of ${MAX_PAGE_COUNT}`)

    const loadMore = dto.length > 0 && nextPage < MAX_PAGE_COUNT
    if (loadMore) {
        await syncReleases(date, nextPage)
    }
}

async function syncGenres() {
    const request = IgdbApi.genres(0)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Genre, function() { return new Genre() }, function(dto, entity) { Mapper.mapGenre(dto, entity) })
    await Database.saveAll(entities)
}

async function syncPlatforms() {
    const request = IgdbApi.platforms(0)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Platform, function() { return new Platform() }, function(dto, entity) { Mapper.mapPlatform(dto, entity) })
    await Database.saveAll(entities)
}