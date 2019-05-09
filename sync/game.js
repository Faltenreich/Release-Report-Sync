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

function loadGamesFromNetwork(language, year, page) {
    return new Promise(function(resolve, reject) {
        const request = IgdbApi.games(language, year, page)
        Networking.sendRequest(request).then(dto => {
            handleGameReleases(dto).then(() => {
                console.log(`Game releases page ${page + 1}`)
                const loadMore = dto.length > 0
                if (loadMore) {
                    loadGamesFromNetwork(language, year, page + 1)
                } else {
                    resolve()
                }
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function handleGameReleases(dto) {
    return new Promise(function(resolve, reject) {
        const externalIds = dto.map(it => "game_" + it.id)
        Database.getByExternalIds(externalIds, Release).then(releases => {
            const promises = dto.map(result => {
                resultExternalId = "game_" + result.id
                const existing = releases.find(release => { return release.externalId == resultExternalId })
                const release = existing != null ? existing : new Release()
                ParseParser.mergeGame(result, release)
                return release
            })
            Promise.all(promises).then(releases => {
                Database.saveAll(releases)
                resolve()
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        }).catch(error => {
            console.log(error)
            reject(error)
        })
    })
}