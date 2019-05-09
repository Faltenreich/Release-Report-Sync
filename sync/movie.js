const Database = include('data/database')
const ParseParser = include('data/parser/parse')
const Networking = include('networking/networking')
const MovieDbApi = include('networking/api/moviedb')

module.exports = {
    start:function(language, year) {
        const loadMovieReleases = function() {
            loadMovieReleasesFromNetwork(language, year, 1).then(() => {
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
function loadMovieReleasesFromNetwork(language, year, page) {
    return new Promise(function(resolve, reject) {
        const request = MovieDbApi.discover(language, year, page)
        Networking.sendRequest(request).then(async function(dto) {
            const page = dto.page
            const pageCount = dto.total_pages
            handleMoviePage(dto).then(() => {
                console.log(`Movie releases page ${page} of ${pageCount}`)
                const loadMore = page < pageCount
                if (loadMore) {
                    loadMovieReleasesFromNetwork(language, year, page + 1)
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