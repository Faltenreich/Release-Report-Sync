module.exports = {
    mapRelease:function(dto, entity) {
        const externalId = ID_PREFIX_DISCOGS + dto.master_id.toString()
        const artistWithTitle = dto.title.split(" - ")
        entity.set("externalId", externalId)
        entity.set("type", "music")
        entity.set("artist", artistWithTitle[0])
        entity.set("title", artistWithTitle[1])
        entity.set("imageUrlForThumbnail", dto.thumb)
        
        entity.set("releasedAt", new Date(Date.parse(dto.release_date)))
        entity.set("popularity", dto.popularity)
        entity.set("imageUrlForCover", dto.images[0].url)
    }
}