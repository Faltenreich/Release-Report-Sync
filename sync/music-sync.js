const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('networking/mapper/music')

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
    const ids = await getUpcomingReleaseIds(page, null, token)
    await syncReleasesForIds(ids, 0, token)
}

async function getUpcomingReleaseIds(page, ids, token) {
    const pageSize = 50
    const request = SpotifyApi.browse(page, pageSize, token)
    const dto = await Networking.sendRequest(request)
    const newIds = dto.albums.items.filter(item => item.album_type == "album").map(item => item.id)
    const loadMore = dto.albums.offset + pageSize < dto.albums.total
    const totalIds = ids != null ? ids.concat(newIds) : newIds
    if (loadMore) {
        return getUpcomingReleaseIds(page + 1, totalIds, token)
    } else {
        return totalIds
    }
}

async function syncReleasesForIds(ids, index, token) {
    const pageSize = 20
    const page = index / pageSize
    const pageCount = Math.ceil(ids.length / pageSize)
    const idsOfPage = ids.slice(index, index + pageSize)

    const request = SpotifyApi.albums(idsOfPage, token)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto.albums, ID_PREFIX_SPOTIFY, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Synced music releases: page ${page + 1} of ${pageCount}`)

    const loadMore = page < pageCount - 1
    if (loadMore) {
        await syncReleasesForIds(ids, index + pageSize, token)
    }
}