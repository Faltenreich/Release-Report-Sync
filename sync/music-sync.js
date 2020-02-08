const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

const BaseUtils = include('util/base')
const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('networking/mapper/music')

const Networking = include('networking/networking')
const DiscogsApi = include('networking/api/discogs')

const REQUEST_DELAY_IN_MILLIS = 1000

module.exports = {
    start:async function(minYear, maxYear) {
        await syncReleases(minYear, 0) // TODO: Iterate until maxYear
        console.log("Synced music releases completely")
    }
}

async function syncReleases(year, page) {
    const request = DiscogsApi.search(year, page)
    const searchDto = await Networking.sendRequest(request)
    const serverIds = searchDto.results.map(dto => dto.master_id)
    const releaseDtos = await getReleaseDtos(serverIds)
    const entities = await DtoParser.parseEntitiesFromDto(releaseDtos, ID_PREFIX_DISCOGS, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity) })
    await Database.saveAll(entities)

    const pageCount = searchDto.pagination.pages
    console.log(`Synced music releases: page ${page + 1} of ${pageCount}`)

    const loadMore = page < pageCount
    if (loadMore) {
        await syncReleases(page + 1)
    }
}

async function getReleaseDtos(serverIds) {
    var dtos = []
    for (const serverId of serverIds) {
        const request = DiscogsApi.getRelease(serverId)
        try {
            const dto = await Networking.sendRequest(request)
            await BaseUtils.sleep(REQUEST_DELAY_IN_MILLIS)
            dtos.push(dto)
        } catch (error) {
            console.log(error)
        }
    }
    return dtos
}