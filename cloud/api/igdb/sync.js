const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Genre = Parse.Object.extend("Genre")
const Platform = Parse.Object.extend("Platform")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('api/igdb/mapper')

const Networking = include('util/networking')
const IgdbApi = include('api/igdb/api')

// Free tier has an offset limit of 150 (see https://api-docs.igdb.com/#pagination)
const MAX_PAGE_COUNT = 150

module.exports = {
    // IGDB is currently not localized
    start:async function(language, minDate, maxDate) {
        try {
            console.log(`Authenticating to Twitch`)
            const accessToken = await authenticate()
            console.log(`Authenticated to Twitch`)
            console.log(`Starting synchronization of game genres`)
            await syncGenres(accessToken)
            console.log(`Completed synchronization of game genres`)
            console.log(`Starting synchronization of game platforms`)
            await syncPlatforms(accessToken)
            console.log(`Completed synchronization of game platforms`)
            console.log(`Starting synchronization of game releases`)
            await syncReleases(accessToken, minDate, maxDate, 0)
            console.log(`Completed synchronization of game releases`)
        } catch (error) {
            console.error(error)
        }
    }
}

async function authenticate() {
    const request = IgdbApi.authenticate()
    const dto = await Networking.sendRequest(request)
    return dto.access_token
}

async function syncGenres(accessToken) {
    const request = IgdbApi.genres(accessToken, 0)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Genre, function() { return new Genre() }, function(dto, entity) { Mapper.mapGenre(dto, entity) })
    await Database.saveAll(entities)
}

async function syncPlatforms(accessToken) {
    const request = IgdbApi.platforms(accessToken, 0)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Platform, function() { return new Platform() }, function(dto, entity) { Mapper.mapPlatform(dto, entity) })
    await Database.saveAll(entities)
}

async function syncReleases(accessToken, minDate, maxDate, page) {
    const request = IgdbApi.games(accessToken, minDate, maxDate, page)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity) })
    await Database.saveAll(entities)
    const nextPage = page + 1
    console.log(`Synchronizing game releases: page ${nextPage}`)

    const loadMore = dto.length > 0 && nextPage < MAX_PAGE_COUNT
    if (loadMore) {
        await syncReleases(minDate, maxDate, nextPage)
    }
}