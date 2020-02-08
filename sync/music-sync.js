const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

const BaseUtils = include('util/base')
const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Mapper = include('networking/mapper/music')

const Networking = include('networking/networking')
const DiscogsApi = include('networking/api/discogs')

const REQUEST_DELAY_IN_MILLIS = 1000
const REGEX_DATE = /^\d{4}\-\d{1,2}\-\d{1,2}$/

module.exports = {
    start:async function(minYear, maxYear) {
        await syncReleases(minYear, 0) // TODO: Iterate until maxYear
        console.log("Synced music releases completely")
    }
}

async function syncReleases(year, page) {
    const request = DiscogsApi.search(year, page)
    const searchDto = await Networking.sendRequest(request)
    const pageCount = searchDto.pagination.pages
    const serverIds = searchDto.results.map(dto => dto.id)
    const releaseDtos = await getReleaseDtos(serverIds, page, pageCount)
    const entities = await DtoParser.parseEntitiesFromDto(releaseDtos, ID_PREFIX_DISCOGS, Release, function() { return new Release() }, function(dto, entity) { Mapper.mapRelease(dto, entity) })
    await Database.saveAll(entities)

    console.log(`Synced music releases: page ${page + 1} of ${pageCount}`)

    const loadMore = page < pageCount
    if (loadMore) {
        await syncReleases(page + 1)
    }
}

async function getReleaseDtos(serverIds, page, pageCount) {
    var dtos = []
    var releaseIndex = 0
    for (const serverId of serverIds) {
        const request = DiscogsApi.getRelease(serverId)
        try {
            const dto = await Networking.sendRequest(request)
            console.log(`Requested music release: ${releaseIndex + 1} of ${serverIds.length} in page ${page + 1} of ${pageCount}`)
            await BaseUtils.sleep(REQUEST_DELAY_IN_MILLIS)
            const isValid = dto.id != null && dto.released != null && REGEX_DATE.test(dto.released)
            if (isValid) {
                dtos.push(dto)
            }
        } catch (error) {
            console.log(error)
        }
        releaseIndex++
    }
    return dtos
}