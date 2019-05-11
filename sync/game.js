const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

const Database = include('data/database')
const DtoParser = include('data/parser/dto')
const Merger = include('data/parser/merge')

const Networking = include('networking/networking')
const IgdbApi = include('networking/api/igdb')

module.exports = {
    start:async function(language, year) {
        await loadGamesFromNetwork(language, year, 0)
        console.log("Game releases completed")
    }
}

async function loadGamesFromNetwork(language, year, page) {
    const request = IgdbApi.games(language, year, page)
    const dto = await Networking.sendRequest(request)
    const entities = await DtoParser.parseEntitiesFromDto(dto, ID_PREFIX_IGDB, Release, function() { return new Release() }, function(dto, entity) { Merger.mergeGameRelease(dto, entity) })
    await Database.saveAll(entities)
    console.log(`Game releases page ${page + 1}`)

    const loadMore = dto.length > 0
    if (loadMore) {
        await loadGamesFromNetwork(language, year, page + 1)
    }
}