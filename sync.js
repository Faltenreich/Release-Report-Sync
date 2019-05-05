const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const uuid = require('uuid')
const Database = require('./database')
const JsonParser = require('./parser/json')
const ParseParser = require('./parser/parse')

const IGDB_HOST = "https://api-endpoint.igdb.com"
const IGDB_API_KEY = "f3bf94eebc26b08c15b707c5d89d2ce3"
const MOVIE_DB_HOST = "https://api.themoviedb.org/3"
const MOVIE_DB_API_KEY = "3f49b57b1f30fc4de49d48e7d4a92d6f"

const currentYear = new Date().getFullYear()

module.exports = {
    start:function() {
        loadMoviesFromNetwork(1, "en")
    }
}

function loadGamesFromNetwork() {
    const endpoint = `/games/?fields=*&filter[first_release_date][gt]=${currentYear}-01-01&order=release_dates.date%3Aasc&limit=20&offset=0`
    const url = IGDB_HOST + endpoint

    const request = new XMLHttpRequest()
    request.open("GET", url)
    request.setRequestHeader("user-key", IGDB_API_KEY)
    request.addEventListener('load', function(event) {
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

function loadMoviesFromJsonFile() {
    var dto = require('./assets/moviedb.json');
    handleMovieFromDto(dto)
}

function loadMoviesFromNetwork(page, language) {
    return new Promise(function(resolve, reject) {
        const host = MOVIE_DB_HOST
        const endpoint = "/discover/movie"
        const params = `?primary_release_year=${currentYear}&sort_by=popularity.desc&language=${language}&page=${page}&api_key=${MOVIE_DB_API_KEY}`
        const url = host + endpoint + params
        loadMoviesFromUrl(url).then(function(page) {
            if (page != null) {
                loadMoviesFromNetwork(page, language)
            } else {
                resolve()
            }
        }, function(error) {
            reject(error)
        })
    })
}

function loadMoviesFromUrl(url) {
    return new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest()
        request.open("GET", url)
        request.addEventListener('load', function(event) {
            if (request.status >= 200 && request.status < 300) {
                const dto = JsonParser.parseDtoFromJson(request.responseText)
                const page = dto.page
                const pageCount = dto.total_pages
                handleMovieFromDto(dto).then(function() {
                    console.log(`Handled movies: page ${page} of ${pageCount}`)
                    const loadMore = page < pageCount
                    const nextPage = loadMore ? page + 1 : null
                    resolve(nextPage)
                }, function(error) {
                    reject(error)
                })
            } else {
                console.log(request.responseText)
                reject()
            }
        })
        request.send()
    })
}

function handleMovieFromDto(dto) {
    return new Promise(function(resolve, reject) {
        const results = dto.results
        handleMovieFromDtoList(results, 0, resolve)
    }, function(error) {
        console.log(error)
        reject(error)
    })
}

function handleMovieFromDtoList(dtos, index, resolve) {
    const dto = dtos[index]
    const onNext = function(error) {
        const hasMore = index < (dtos.length - 1)
        if (hasMore) {
            handleMovieFromDtoList(dtos, index + 1, resolve)
        } else {
            if (error == null) {
                resolve()
            } else {
                reject()
            }
        }
    }
    ParseParser.parseMovieFromDto(dto).then(function(movie) {
        Database.save(movie).then(function() {
            console.log(`Handled movie: index ${index + 1} of ${dtos.length}`)
            onNext()
        }, function(error) {
            console.log(error)
            onNext()
        })
    }, function(error) {
        console.log(error)
        onNext(error)
    })
}