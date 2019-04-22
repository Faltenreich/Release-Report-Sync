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
            release.save().then((release) => { }, (error) => { console.log(error) })
        })
    }
}

module.exports = {
    parseJsonFromMovieDb:function(json) {
        const discoverDto = JSON.parse(json)
        const page = discoverDto.page
        const pageCount = discoverDto.total_pages
        const results = discoverDto.results
        results.forEach(dto => {
            var release = new Release()
            release.set("externalId", dto.id.toString())
            release.set("title", dto.title)
            release.set("description", dto.overview)
            release.set("releasedAt", new Date(Date.parse(dto.release_date)))
            release.save().then((release) => { }, (error) => { console.log(error) })
        })
    }
}