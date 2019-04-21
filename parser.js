const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

module.exports = {
    parseJsonFromIgdb:function(json) {
        const dtoList = JSON.parse(json)
        for (var index = 0; index < dtoList.length; index++) {
            var dto = dtoList[index]
            const release = new Release()
            release.set("title", dto.name)
            release.save()
            .then((gameScore) => {
                console.log('New object created with objectId: ' + gameScore.id);
              }, (error) => {
                console.log('Failed to create new object, with error code: ' + error.message)
              })
        }
    }
}