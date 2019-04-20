const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const uuid = require('uuid')
const Parse = require('parse/node')

start()

function start() {
    const host = "https://api-endpoint.igdb.com"
    const endpoint = "/games/?fields=*&filter[first_release_date][gt]=2018-01-01&order=release_dates.date%3Aasc&limit=20&offset=0"
    const url = host + endpoint
    const apiKey = "f3bf94eebc26b08c15b707c5d89d2ce3"

    var request = new XMLHttpRequest()
    request.open("GET", url)
    request.setRequestHeader("user-key", apiKey)
    request.addEventListener('load', function(event) {
        if (request.status >= 200 && request.status < 300) {
            parseResponse(request.responseText)
        } else {
            console.log(request.responseText)
        }
    })
    request.send()
}

function parseResponse(response) {
    console.log(response)
}