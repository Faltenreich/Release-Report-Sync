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
        loadMoviesFromJsonFile()
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
            JsonParser.parseJsonFromIgdb(request.responseText)
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

function loadMoviesFromNetwork() {
    // TODO: Make dynamic
    const page = 1
    const language = "en"

    const host = MOVIE_DB_HOST
    const endpoint = "/discover/movie"
    const params = `?primary_release_year=${currentYear}&sort_by=popularity.desc&language=${language}&page=${page}&api_key=${MOVIE_DB_API_KEY}`
    const url = host + endpoint + params

    loadMoviesFromUrl(url)
}

function loadMoviesFromUrl(url) {
    const request = new XMLHttpRequest()
    request.open("GET", url)
    request.addEventListener('load', function(event) {
        if (request.status >= 200 && request.status < 300) {
            const dto = JsonParser.parseDtoFromJson(request.responseText)
            handleMovieFromDto(dto)
        } else {
            console.log(request.responseText)
        }
    })
    request.send()
}

function handleMovieFromDto(dto) {
    const page = dto.page
    const pageCount = dto.total_pages
    const results = dto.results
    handleMovieFromDtoList(results, 0).then(function(result) {
        console.log("Successfully loaded movies")
    }, function(error) {
        console.log(`Failed to load movies: ${error}`)
    })
}

function handleMovieFromDtoList(dtos, page) {
    return new Promise(function(resolve, reject) {
        const dto = dtos[page]
        const onNext = function(error) {
            const hasMore = page < (dtos.length - 1)
            if (hasMore) {
                handleMovieFromDtoList(dtos, page + 1)
            } else {
                if (error == null) {
                    resolve()
                } else {
                    reject()
                }
            }
        }
        ParseParser.parseMovieFromDto(dto).then(function(movie) {
            Database.save(movie).then(function(result) {
                onNext()
            }, function(error) {
                console.log(error)
                onNext()
            })
        }, function(error) {
            console.log(error)
            onNext(error)
        })
    })
}