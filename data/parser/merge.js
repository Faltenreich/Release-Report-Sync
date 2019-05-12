const IMAGE_HOST_IGDB = "https://images.igdb.com/igdb/image/upload"
const IMAGE_HOST_MOVIEDB = "https://image.tmdb.org/t/p"

module.exports = {
    mergeGameGenre:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("title", dto.name)
    },
    mergeGamePlatform:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("title", dto.name)
    },
    mergeGameRelease:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("type", "game")
        entity.set("title", dto.name)
        entity.set("description", dto.summary)
        entity.set("releasedAt", dto.first_release_date != null? new Date(dto.first_release_date * 1000) : null)
        entity.set("popularity", dto.popularity)
        if (dto.cover != null && dto.cover.url != null) {
            const url = "https:" + dto.cover.url
            entity.set("imageUrlForThumbnail", IMAGE_HOST_IGDB + `/t_cover_small/${dto.cover.image_id}.jpg`)
            entity.set("imageUrlForCover", IMAGE_HOST_IGDB + `/t_cover_big_2x/${dto.cover.image_id}.jpg`)
        }
        if (dto.screenshots != null && dto.screenshots.length > 0) {
            entity.set("imageUrlForWallpaper", IMAGE_HOST_IGDB + `/t_1080p/${dto.screenshots[0].image_id}.jpg`)
        }
        if (dto.genres != null) {
            dto.genres.forEach(genre => {
                const externalId = ID_PREFIX_IGDB + genre.id.toString()
                entity.addUnique("genres", externalId)
            })
        }
    },
    mergeMovieGenre:function(dto, entity) {
        const externalId = ID_PREFIX_MOVIEDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("title", dto.name)
    },
    mergeMovieRelease:function(dto, entity) {
        const externalId = ID_PREFIX_MOVIEDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("type", "movie")
        entity.set("title", dto.title)
        entity.set("description", dto.overview)
        entity.set("releasedAt", new Date(Date.parse(dto.release_date)))
        entity.set("popularity", dto.popularity)
        entity.set("imageUrlForThumbnail", IMAGE_HOST_MOVIEDB + "/w342/" + dto.poster_path)
        entity.set("imageUrlForCover", IMAGE_HOST_MOVIEDB + "/w780/" + dto.poster_path)
        entity.set("imageUrlForWallpaper", IMAGE_HOST_MOVIEDB + "/w1280/" + dto.backdrop_path)
        dto.genre_ids.forEach(genreId => {
            const externalId = ID_PREFIX_MOVIEDB + genreId.toString()
            entity.addUnique("genres", externalId)
        })
    }
}