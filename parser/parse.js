const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Genre = Parse.Object.extend("Genre")
const Database = require('../database')

const IMAGE_HOST_MOVIE_DB = "https://image.tmdb.org/t/p"

module.exports = {
    parseMovieReleaseFromDto:function(dto) {
        return new Promise(function(resolve, reject) {
            const externalId = "moviedb_" + dto.id.toString()
            Database.getByExternalId(externalId, Release).then(release => {
                release = release != null ? release : new Release()
                release.set("externalId", externalId)
                release.set("type", "movie")
                release.set("title", dto.title)
                release.set("description", dto.overview)
                release.set("releasedAt", new Date(Date.parse(dto.release_date)))
                release.set("popularity", dto.popularity)
                release.set("imageUrlForThumbnail", IMAGE_HOST_MOVIE_DB + "/w342/" + dto.poster_path)
                release.set("imageUrlForCover", IMAGE_HOST_MOVIE_DB + "/w780/" + dto.poster_path)
                release.set("imageUrlForWallpaper", IMAGE_HOST_MOVIE_DB + "/w1280/" + dto.backdrop_path)
                resolve(release)
            }).catch(error => {
                reject(error)
            })
        })
    },
    parseMovieGenreFromDto:function(dto) {
        return new Promise(function(resolve, reject) {
            const externalId = "moviedb_" + dto.id.toString()
            Database.getByExternalId(externalId, Genre).then(genre => {
                genre = genre != null ? genre : new Genre()
                genre.set("externalId", externalId)
                genre.set("title", dto.name)
                resolve(genre)
            }).catch(error => {
                reject(error)
            })
        })
    }
}