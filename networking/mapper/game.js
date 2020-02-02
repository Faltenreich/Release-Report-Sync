const IMAGE_HOST_IGDB = "https://images.igdb.com/igdb/image/upload"
const VIDEO_HOST_IGDB = "https://www.youtube.com"

module.exports = {
    mapGenre:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("title", dto.name)
    },
    mapPlatform:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        const title = dto.name.replace("PC (Microsoft Windows)", "Windows")
        entity.set("externalId", externalId)
        entity.set("title", title)
    },
    mapRelease:function(dto, entity) {
        const externalId = ID_PREFIX_IGDB + dto.id.toString()
        entity.set("externalId", externalId)
        entity.set("type", "game")
        if (dto.involved_companies != null) {
            const developer = dto.involved_companies.find(company => { return company.developer })
            if (developer != null && developer.company != null) {
                entity.set("artist", developer.company.name)
            }
        }
        entity.set("title", dto.name)
        entity.set("description", dto.summary)
        entity.set("releasedAt", dto.first_release_date != null? new Date(dto.first_release_date * 1000) : null)
        entity.set("popularity", dto.popularity)
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
    }
}