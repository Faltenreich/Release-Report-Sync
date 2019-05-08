const Database = require('./database')
const Networking = require('./networking')
const IgdbApi = require('./api/igdb')
const MovieDbApi = require('./api/moviedb')
const ParseParser = require('./parser/parse')

const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

const currentYear = new Date().getFullYear()

module.exports = {
    start:function() {
        const language = "en"
        loadMovies(language)
    }
}

function loadGames(language) {
    loadGamesFromNetwork(0, language)
}

function loadGamesFromNetwork(page, language) {
    const request = IgdbApi.games(currentYear, page, language)
    sendRequest(request).then(dto => {
        handleGameReleases(dto).then(() => {
            console.log(`Game releases page ${page + 1}`)
            const loadMore = dto.length > 0
            if (loadMore) {
                loadGamesFromNetwork(page + 1, language)
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
}

function sendRequest(request) {
    return new Promise(function(resolve, reject) {
        Networking.sendRequest(request).then(dto => {
            resolve(dto)
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

function loadMovies(language) {
    const loadMovieReleases = function() {
        loadMovieReleasesFromNetwork(1, language).then(() => {
            console.log("Movie releases completed")
        }).catch(error => {
            console.log("Movie releases failed")
        })
    }

    loadMovieGenresFromNetwork(language).then(() => {
        console.log("Movie genres completed")
        loadMovieReleases()
    }).catch(error => {
        console.log("Movie genres failed: " + error)
        loadMovieReleases()
    })
}

function loadMovieGenresFromNetwork(language) {
    return new Promise(function(resolve, reject) {
        const request = MovieDbApi.genres(language)
        Networking.sendRequest(request).then(async function(dto) {
            handleMovieGenres(dto).then(() => {
                console.log(`Movie genres page 1 of 1`)
                resolve()
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function handleMovieGenres(dto) {
    const promises = dto.genres.map(result => { return handleMovieGenre(result) })
    return Promise.all(promises).then(genres => {
        Database.saveAll(genres)
    }).catch(error => {
        console(error)
    })
}

function handleMovieGenre(dto) {
    return new Promise(function(resolve, reject) {
        ParseParser.parseMovieGenreFromDto(dto).then(genre => {
            resolve(genre)
        }).catch(error => {
            reject(error)
        })
    })
}

function loadMovieReleasesFromJsonFile() {
    const dto = require('./assets/moviedb/discover.json');
    handleMovieFromDto(1, 1, dto)
}

// FIXME: UnhandledPromiseRejectionWarning somewhere deep down
function loadMovieReleasesFromNetwork(page, language) {
    return new Promise(function(resolve, reject) {
        const request = MovieDbApi.discover(currentYear, page, language)
        Networking.sendRequest(request).then(async function(dto) {
            const page = dto.page
            const pageCount = dto.total_pages
            handleMoviePage(dto).then(() => {
                console.log(`Movie releases page ${page} of ${pageCount}`)
                const loadMore = page < pageCount
                if (loadMore) {
                    loadMovieReleasesFromNetwork(page + 1, language)
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

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function handleMoviePage(dto) {
    const promises = dto.results.map(result => { return handleMovie(result) })
    return Promise.all(promises).then(movies => {
        Database.saveAll(movies)
    }).catch(error => {
        console(error)
    })
}

function handleMovie(dto) {
    return new Promise(function(resolve, reject) {
        ParseParser.parseMovieReleaseFromDto(dto).then(movie => {
            resolve(movie)
        }).catch(error => {
            reject(error)
        })
    })
}