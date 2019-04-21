const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

module.exports = {
    parseJsonFromIgdb:function(json) {
        JSON.parse(json).forEach(dto => {
            var release = new Release()
            release.set("externalId", dto.id.toString())
            release.set("title", dto.name)
            release.set("description", dto.summary)
            release.set("releasedAt", new Date(dto.first_release_date))
            release.save()
        })
    }
}