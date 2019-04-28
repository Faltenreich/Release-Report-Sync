const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Database = require('./database')

const IMAGE_HOST_MOVIE_DB = "https://image.tmdb.org/t/p"

module.exports = {
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
    }
}

module.exports = {
    parseJsonFromMovieDb:function(json) {
        const discoverDto = JSON.parse(json)
        const page = discoverDto.page
        const pageCount = discoverDto.total_pages
        const results = discoverDto.results
        saveMovies(results, 0)
    }
}

function saveMovies(dtos, index) {
    const dto = dtos[index]
    const release = new Release()
    release.set("externalId", dto.id.toString())
    release.set("title", dto.title)
    release.set("description", dto.overview)
    release.set("releasedAt", new Date(Date.parse(dto.release_date)))
    release.set("popularity", dto.popularity)
    release.set("imageUrlForThumbnail", IMAGE_HOST_MOVIE_DB + "/w342/" + dto.poster_path)
    release.set("imageUrlForCover", IMAGE_HOST_MOVIE_DB + "/w780/" + dto.poster_path)
    release.set("imageUrlForWallpaper", IMAGE_HOST_MOVIE_DB + "/w1280/" + dto.backdrop_path)
    Database.save(release, function() {
        const hasMore = index < dtos.length
        if (hasMore) {
            saveMovies(dtos, index + 1)
        } else {
            console.log("Finished saving movies")
        }
    })
}