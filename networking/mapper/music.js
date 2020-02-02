module.exports = {
    mapRelease:function(dto, entity) {
        const externalId = ID_PREFIX_SPOTIFY + dto.id.toString()
        const artist = dto.artists.map(artist => artist.name).join(", ")
        const tracklist = dto.tracks.items.map(track => `${track.track_number}. ${track.name}`).join("\n")
        entity.set("externalId", externalId)
        entity.set("type", "music")
        entity.set("artist", artist)
        entity.set("title", dto.name)
        entity.set("description", tracklist)
        entity.set("releasedAt", new Date(Date.parse(dto.release_date)))
        entity.set("popularity", dto.popularity)
        if (dto.images != null && dto.images.length > 0) {
            entity.set("imageUrlForCover", dto.images[0].url)
            if (dto.images.length > 1) {
                entity.set("imageUrlForThumbnail", dto.images[1].url)
            }
        }
    }
}