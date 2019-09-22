const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Merger = include('data/parser/merge')

const Networking = include('networking/networking')
const SpotifyApi = include('networking/api/spotify')

module.exports = {
    start:async function(language, date) {
        const token = await getToken()
        console.log(`Received token for music releases`)
    }
}

async function getToken() {
    const request = SpotifyApi.token()
    const dto = await Networking.sendRequest(request)
    return dto.access_token
}

async function syncReleases(page) {
    const request = SpotifyApi.browse()
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto.genres, ID_PREFIX_MOVIEDB, Release, function() { return new Release() }, function(dto, entity) { Merger.mergeMusicRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced music releases: page ${page + 1} of 1`)

    const loadMore = false
    if (loadMore) {
        await syncReleases(page + 1)
    } else {
        return
    }
}