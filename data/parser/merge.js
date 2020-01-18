const IMAGE_HOST_IGDB = "https://images.igdb.com/igdb/image/upload"
const VIDEO_HOST_IGDB = "https://www.youtube.com"

const IMAGE_HOST_MOVIEDB = "https://image.tmdb.org/t/p"

// Target max popularity is 1000, so we approach it

module.exports = {
    mergeGameGenre:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("title", dto.name)
    },
    mergeGamePlatform:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        const title = dto.name.replace("PC (Microsoft Windows)", "Windows")
        entity.set("externalId", externalId)
        entity.set("title", title)
    },
    mergeGameRelease:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("type", "game")
        entity.set("artist", null) // TODO
        entity.set("title", dto.name)
        entity.set("description", dto.summary)
        entity.set("releasedAt", dto.first_release_date != null? new Date(dto.first_release_date * 1000) : null)
        entity.set("popularity", dto.popularity * 1.667) // is open ended, mostly capped at 600
        entity.set("externalUrl", dto.url)
        if (dto.cover != null && dto.cover.url != null && dto.cover.image_id) {
            entity.set("imageUrlForThumbnail", IMAGE_HOST_IGDB + `/t_cover_big/${dto.cover.image_id}.jpg`)
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
                const imageId = screenshot.image_id
                if (imageId) {
                    const url = IMAGE_HOST_IGDB + `/t_1080p/${screenshot.image_id}.jpg`
                    const isWallpaper = index == 0
                    if (isWallpaper) {
                        entity.set("imageUrlForWallpaper", url)
                    } else {
                        entity.addUnique("imageUrls", url)
                    }
                }
            })
        }
        if (dto.videos != null) {
            dto.videos.forEach(video => {
                const videoId = video.video_id
                if (videoId) {
                    const url = VIDEO_HOST_IGDB + "/watch?v=" + videoId
                    entity.addUnique("videoUrls", url)
                }
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
        entity.set("artist", null) // TODO
        entity.set("title", dto.title)
        entity.set("description", dto.overview)
        entity.set("releasedAt", new Date(Date.parse(dto.release_date)))
        entity.set("popularity", dto.popularity * 1.667) // is open ended, mostly capped at 600
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
    },
    mergeMusicRelease:function(dto, entity) {
        const externalId = ID_PREFIX_SPOTIFY + dto.id.toString()
        const artist = dto.artists.map(artist => artist.name).join(", ")
        const tracklist = dto.tracks.items.map(track => `${track.track_number}. ${track.name}`).join("\n")
        entity.set("externalId", externalId)
        entity.set("type", "music")
        entity.set("artist", artist)
        entity.set("title", dto.name)
        entity.set("description", tracklist)
        entity.set("releasedAt", new Date(Date.parse(dto.release_date)))
        entity.set("popularity", dto.popularity * 10) // is closed ended, capped at 100
        if (dto.images != null && dto.images.length > 0) {
            entity.set("imageUrlForCover", dto.images[0].url)
            if (dto.images.length > 1) {
                entity.set("imageUrlForThumbnail", dto.images[1].url)
            }
        }
    }
}