const IMAGE_HOST_IGDB = "https://images.igdb.com/igdb/image/upload"
const VIDEO_HOST_IGDB = "https://www.youtube.com"

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
        entity.set("externalUrl", dto.url)
        if (dto.cover != null && dto.cover.url != null) {
            entity.set("imageUrlForThumbnail", IMAGE_HOST_IGDB + `/t_cover_small/${dto.cover.image_id}.jpg`)
            entity.set("imageUrlForCover", IMAGE_HOST_IGDB + `/t_cover_big_2x/${dto.cover.image_id}.jpg`)
        }
        if (dto.genres != null) {
            dto.genres.forEach(genre => {
                const externalId = ID_PREFIX_IGDB + genre.toString()
                entity.addUnique("genres", externalId)
            })
        }
        if (dto.platforms != null) {
            dto.platforms.forEach(platform => {
                const externalId = ID_PREFIX_IGDB + platform.toString()
                entity.addUnique("platforms", externalId)
            })
        }
        if (dto.screenshots != null) {
            dto.screenshots.forEach((screenshot, index) => {
                const url = IMAGE_HOST_IGDB + `/t_1080p/${screenshot.image_id}.jpg`
                const isWallpaper = index == 0
                if (isWallpaper) {
                    entity.set("imageUrlForWallpaper", url)
                } else {
                    entity.addUnique("images", url)
                }
            })
        }
        if (dto.videos != null) {
            dto.videos.forEach(video => {
                const url = VIDEO_HOST_IGDB + "/watch?v=" + video.video_id
                entity.addUnique("videos", url)
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
    },
    mergeMusicRelease:function(dto, entity) {
        const externalId = ID_PREFIX_SPOTIFY + dto.id.toString()
        entity.set("externalId", externalId)
        // TODO
    }
}