const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const JsonParser = require('./parser/json')

module.exports = {
    request:function(url, headers) {
        return new Promise(function(resolve, reject) {
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
    }
}