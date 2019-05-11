const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")
const Genre = Parse.Object.extend("Genre")
const Database = include('data/database')

const IMAGE_HOST_MOVIE_DB = "https://image.tmdb.org/t/p"

module.exports = {
    mergeGame:function(dto, release) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        release.set("externalId", externalId)
        release.set("type", "game")
        release.set("title", dto.name)
        release.set("description", dto.summary)
        release.set("releasedAt", new Date(dto.first_release_date))
        release.set("popularity", dto.popularity)
        if (dto.cover != null && dto.cover.url != null) {
            const url = "https:" + dto.cover.url
            release.set("imageUrlForThumbnail", url.replace("/t_thumb/", "/t_cover_big/"))
            release.set("imageUrlForCover", url.replace("/t_thumb/", "/t_1080p/"))
        }
        if (dto.genres != null) {
            dto.genres.forEach(genreId => {
                const externalId = ID_PREFIX_IGDB + genreId.toString()
                release.addUnique("genres", externalId)
            })
        }
    },
    parseMovieGenreFromDto:async function(dto) {
        const externalId = ID_PREFIX_MOVIEDB + dto.id.toString()
        let genre = await Database.getByExternalId(externalId, Genre)
        genre = genre != null ? genre : new Genre()
        genre.set("externalId", externalId)
        genre.set("title", dto.name)
        return genre
    },
    parseMovieReleaseFromDto:async function(dto) {
        const externalId = ID_PREFIX_MOVIEDB + dto.id.toString()
        let release = await Database.getByExternalId(externalId, Release)
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
        dto.genre_ids.forEach(genreId => {
            const externalId = ID_PREFIX_MOVIEDB + genreId.toString()
            release.addUnique("genres", externalId)
        })
        return release
    }
}