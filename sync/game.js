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
    const releases = await Database.getByExternalIds(externalIds, Release)
    const promises = dto.map(result => {
        resultExternalId = ID_PREFIX_IGDB + result.id
        const existing = releases.find(release => { return release.externalId == resultExternalId })
        const release = existing != null ? existing : new Release()
        ParseParser.mergeGame(result, release)
        return release
    })
    return await Promise.all(promises).then(async releases => {
        await Database.saveAll(releases)
    }).catch(error => {
        throw(error)
    })
}