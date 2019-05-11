const Database = include('data/database')
const ParseParser = include('data/parser/parse')
const Networking = include('networking/networking')
const IgdbApi = include('networking/api/igdb')

// TODO: Encapsulate dependencies
const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

module.exports = {
    start:function(language, year) {
        loadGamesFromNetwork(language, year, 0)
    }
}

async function loadGamesFromNetwork(language, year, page) {
    const request = IgdbApi.games(language, year, page)
    const dto = await Networking.sendRequest(request)
    await handleGameReleases(dto)
    console.log(`Game releases page ${page + 1}`)
    const loadMore = dto.length > 0
    if (loadMore) {
        await loadGamesFromNetwork(language, year, page + 1)
    }
}

async function handleGameReleases(dto) {
    const externalIds = dto.map(it => ID_PREFIX_IGDB + it.id)
    const entities = await Database.getByExternalIds(externalIds, Release)
    const promises = dto.map(result => {
        const existing = entities.find(entity => { return entity.externalId == ID_PREFIX_IGDB + result.id })
        const entity = existing != null ? existing : new Release()
        ParseParser.mergeGameRelease(result, entity)
        return entity
    })
    return await Promise.all(promises).then(async entities => {
        await Database.saveAll(entities)
    }).catch(error => {
        throw(error)
    })
}