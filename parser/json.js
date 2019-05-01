const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Database = require('../database')

const IMAGE_HOST_MOVIE_DB = "https://image.tmdb.org/t/p"

module.exports = {
    parseDtoFromJson:function(json) {
        return JSON.parse(json)
    },
    parseJsonFromIgdb:function(json) {
        JSON.parse(json).forEach(dto => {
            const release = new Release()
            release.set("externalId", dto.id.toString())
            release.set("title", dto.name)
            release.set("description", dto.summary)
            release.set("releasedAt", new Date(dto.first_release_date))
            release.set("popularity", dto.popularity)
            release.set("imageUrlForThumbnail", "https:" + dto.cover.replace("/t_thumb/", "/t_cover_big/"))
            release.set("imageUrlForCover", "https:" + dto.cover.replace("/t_thumb/", "/t_1080p/"))
            Database.save(release, {})
        })
    },
    parseJsonFromMovieDb:function(json) {
        const discoverDto = JSON.parse(json)
        const page = discoverDto.page
        const pageCount = discoverDto.total_pages
        const results = discoverDto.results
        saveMovie(results, 0)
    }
}