const Database = require('./database')
const Networking = require('./networking')
const ParseParser = require('./parser/parse')

const IGDB_HOST = "https://api-endpoint.igdb.com"
const IGDB_API_KEY = "f3bf94eebc26b08c15b707c5d89d2ce3"
const MOVIE_DB_HOST = "https://api.themoviedb.org/3"
const MOVIE_DB_API_KEY = "3f49b57b1f30fc4de49d48e7d4a92d6f"
const MOVIE_DB_RATE_INTERVAL = 250

const currentYear = new Date().getFullYear()

module.exports = {
    start:function() {
        const language = "en"
        loadGames(language)
    }
}

function loadGames(language) {
    loadGamesFromNetwork(0, language)
}

function loadGamesFromNetwork(page, language) {
    const limit = 20
    const offset = page * limit
    const endpoint = "/games/"
    const params = `?fields=*&filter[first_release_date][gt]=${currentYear}-01-01&order=release_dates.date%3Aasc&limit=${limit}&offset=${offset}`
    const url = IGDB_HOST + endpoint + params
    const headers = { "user-key": IGDB_API_KEY }
    Networking.request(url, headers).then(dto => {
        handleGameReleases(dto).then(() => {
            console.log(`Game releases page ${page}`)
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

function handleGameReleases(dto) {
    const promises = dto.map(result => { return handleGameRelease(result) })
    return Promise.all(promises).then(releases => {
        Database.saveAll(releases)
    }).catch(error => {
        console.log(error)
    })
}

function handleGameRelease(dto) {
    return new Promise(function(resolve, reject) {
        ParseParser.parseGameReleaseFromDto(dto).then(game => {
            resolve(game)
        }).catch(error => {
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
        const host = MOVIE_DB_HOST
        const endpoint = "/genre/movie/list"
        const params = `?language=${language}&api_key=${MOVIE_DB_API_KEY}`
        const url = host + endpoint + params
        Networking.request(url).then(async function(dto) {
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
        const host = MOVIE_DB_HOST
        const endpoint = "/discover/movie"
        const params = `?primary_release_year=${currentYear}&sort_by=popularity.desc&language=${language}&page=${page}&api_key=${MOVIE_DB_API_KEY}`
        const url = host + endpoint + params
        Networking.request(url).then(async function(dto) {
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