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
        await syncReleases(0, token)
        console.log("Synced music releases completely")
    }
}

async function getToken() {
    const request = SpotifyApi.token()
    const dto = await Networking.sendRequest(request)
    return dto.access_token
}

async function syncReleases(page, token) {
    const ids = getUpcomingReleaseIds(page, token)
}

async function getUpcomingReleaseIds(page, token) {
    const request = SpotifyApi.browse(page, token)
    const dto = await Networking.sendRequest(request)
    const ids = dto.albums.items.filter(item => item.album_type == "album").map(item => item.id)
    return ids
}

async function syncReleasesForIds(page, ids, token) {
    const request = SpotifyApi.albums(ids, token)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto.albums.items, ID_PREFIX_SPOTIFY, Release, function() { return new Release() }, function(dto, entity) { Merger.mergeMusicRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced music releases: page ${page + 1} of 1`)

    const loadMore = false
    if (loadMore) {
        await syncReleases(page + 1, token)
    } else {
        return
    }
}