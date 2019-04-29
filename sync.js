const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const uuid = require('uuid')
const Parser = require('./parser')

const MOVIE_DB_HOST = "https://api.themoviedb.org/3"
const MOVIE_DB_API_KEY = "3f49b57b1f30fc4de49d48e7d4a92d6f"

module.exports = {
    start:function() {
        // syncGames()
        syncMovies()
    }
}

function syncGames() {
    const host = "https://api-endpoint.igdb.com"
    const apiKey = "f3bf94eebc26b08c15b707c5d89d2ce3"
    const year = 2019
    const endpoint = `/games/?fields=*&filter[first_release_date][gt]=${year}-01-01&order=release_dates.date%3Aasc&limit=20&offset=0`
    const url = host + endpoint

    const request = new XMLHttpRequest()
    request.open("GET", url)
    request.setRequestHeader("user-key", apiKey)
    request.addEventListener('load', function(event) {
        if (request.status >= 200 && request.status < 300) {
            Parser.parseJsonFromIgdb(request.responseText)
        } else {
            console.log(request.responseText)
        }
    })
    request.send()
}

function syncMovies() {
    syncMovies(1, "en")
}

function syncMovies(page, language) {
    const endpoint = `/movie/upcoming?language=${language}&page=${page}&api_key=${MOVIE_DB_API_KEY}`
    const url = MOVIE_DB_HOST + endpoint

    const request = new XMLHttpRequest()
    request.open("GET", url)
    request.addEventListener('load', function(event) {
        if (request.status >= 200 && request.status < 300) {
            Parser.parseJsonFromMovieDb(request.responseText)
        } else {
            console.log(request.responseText)
            reject()
        }
    })
    request.send()
}