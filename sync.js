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
}

function loadGamesFromNetwork() {
    const endpoint = `/games/?fields=*&filter[first_release_date][gt]=${currentYear}-01-01&order=release_dates.date%3Aasc&limit=20&offset=0`
    const url = IGDB_HOST + endpoint

    const request = new XMLHttpRequest()
    request.open("GET", url)
    request.setRequestHeader("user-key", IGDB_API_KEY)
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 300) {
            JSON.parse(request.responseText).forEach(dto => {
                const release = new Release()
                release.set("externalId", dto.id.toString())
                release.set("title", dto.name)
                release.set("description", dto.summary)
                release.set("releasedAt", new Date(dto.first_release_date))
                release.set("popularity", dto.popularity)
                release.set("imageUrlForThumbnail", "https:" + dto.cover.replace("/t_thumb/", "/t_cover_big/"))
                release.set("imageUrlForCover", "https:" + dto.cover.replace("/t_thumb/", "/t_1080p/"))
                Database.save(release, {})
            })
        } else {
            console.log(request.responseText)
        }
    })
    request.send()
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
    var dto = require('./assets/moviedb.json');
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