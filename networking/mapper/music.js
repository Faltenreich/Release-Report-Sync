module.exports = {
    mapRelease:function(dto, entity) {
        const externalId = ID_PREFIX_DISCOGS + dto.id.toString()
        const tracklist = dto.tracklist.map(track => `${track.position}: ${track.title}`).join("\n")
        entity.set("externalId", externalId)
        entity.set("type", "music")
        entity.set("artist", dto.artists.map(artist => artist.name).join(", "))
        entity.set("title", dto.title)
        entity.set("description", dto.notes != null ? `${dto.notes}\n\n${tracklist}` : tracklist)
        entity.set("releasedAt", new Date(Date.parse(dto.released)))
        entity.set("externalUrl", dto.uri)
        entity.set("popularity", 100) // TODO
        entity.set("genres", dto.genres != null ? dto.genres.map(genre => genre) : null)
        entity.set("imageUrlForThumbnail", dto.thumb)
        entity.set("imageUrlForCover", dto.images!= null && dto.images.length > 0 ? dto.images[0].uri : null)
        entity.set("imageUrlForWallpaper", dto.artists!= null && dto.artists.length > 0 ? dto.artists[0].thumbnail_url : null)
        entity.set("videoUrls", dto.videos != null ? dto.videos.map(video => video.uri) : null)
    }
}