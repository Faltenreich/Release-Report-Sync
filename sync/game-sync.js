const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Genre = Parse.Object.extend("Genre")
const Platform = Parse.Object.extend("Platform")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Merger = include('data/parser/merge')

const Networking = include('networking/networking')
const IgdbApi = include('networking/api/igdb')

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
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Release, function() { return new Release() }, function(dto, entity) { Merger.mergeGameRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced game releases: page ${page + 1}`)

    const loadMore = dto.length > 0
    if (loadMore) {
        await syncReleases(date, page + 1)
    }
}

async function syncGenres() {
    const request = IgdbApi.genres(0)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Genre, function() { return new Genre() }, function(dto, entity) { Merger.mergeGameGenre(dto, entity) })
    await Database.saveAll(entities)
}

async function syncPlatforms() {
    const request = IgdbApi.platforms(0)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Platform, function() { return new Platform() }, function(dto, entity) { Merger.mergeGamePlatform(dto, entity) })
    await Database.saveAll(entities)
}