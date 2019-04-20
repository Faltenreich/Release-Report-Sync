module.exports = {
    parseResponse:function(response) {
        var json = JSON.parse(response)
        parseJsonFromIgdb(json)
    }
}

function parseJsonFromIgdb(json) {
    for (var index = 0; index < json.length; index++) {
        var dto = json[index]
        console.log(dto)
    }
}