const IMAGE_HOST_MOVIEDB = "https://image.tmdb.org/t/p"

module.exports = {
    mapGenre:function(dto, entity) {
        const externalId = ID_PREFIX_MOVIEDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("title", dto.name)
    },
    mapRelease:function(dto, entity, popularityFactor) {
        const externalId = ID_PREFIX_MOVIEDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("type", "movie")
        entity.set("artist", null) // TODO
        entity.set("title", dto.title)
        entity.set("description", dto.overview)
        entity.set("releasedAt", new Date(Date.parse(dto.release_date)))
        entity.set("popularity", dto.popularity * popularityFactor)
        if (dto.poster_path) {
            entity.set("imageUrlForThumbnail", IMAGE_HOST_MOVIEDB + "/w342/" + dto.poster_path)
            entity.set("imageUrlForCover", IMAGE_HOST_MOVIEDB + "/w780/" + dto.poster_path)
        }
        if (dto.backdrop_path) {
            entity.set("imageUrlForWallpaper", IMAGE_HOST_MOVIEDB + "/w1280/" + dto.backdrop_path)
        }
        dto.genre_ids.forEach(genreId => {
            const externalId = ID_PREFIX_MOVIEDB + genreId.toString()
            entity.addUnique("genres", externalId)
        })
    }
}