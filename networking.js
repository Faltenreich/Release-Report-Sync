const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const JsonParser = require('./parser/json')

module.exports = {
    request:function(url) {
        return new Promise(function(resolve, reject) {
            const request = new XMLHttpRequest()
            request.open("GET", url)
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