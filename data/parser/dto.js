const Database = include('data/database')

module.exports = {
    parseEntitiesFromDto:async function (dto, prefix, type, onInstantiate, onMerge) {
        const externalIds = dto.map(it => prefix + it.id)
        const entities = await Database.getByExternalIds(externalIds, type)
        const promises = dto.map(dto => {
            const existing = entities.find(entity => { return entity.attributes.externalId == prefix + dto.id })
            const entity = existing != null ? existing : onInstantiate()
            onMerge(dto, entity)
            return entity
        })
        return await Promise.all(promises)
    }
}