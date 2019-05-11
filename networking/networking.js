const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const JsonParser = include('data/parser/json')

module.exports = {
    sendRequest:async function(params) {
        const promise = new Promise(function(resolve, reject) {
            const url = params.url
            const headers = params.headers
            
            const request = new XMLHttpRequest()
            request.open("GET", url)

            if (headers) {
                for (let key in headers) {
                    const value = headers[key]
                    request.setRequestHeader(key, value)
                }
            }

            request.addEventListener('load', () => {
                if (request.status >= 200 && request.status < 300) {
                    const dto = JsonParser.parseDtoFromJson(request.responseText)
                    resolve(dto)
                } else {
                    console.log(request.responseText)
                    reject()
                }
            })
            request.send()
        })
        return await promise
    }
}