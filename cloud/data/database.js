const Parse = require('parse/node')

module.exports = {
    getByExternalIds:async function(ids, type) {
        const query = new Parse.Query(type)
        query.containedIn("externalId", ids)
        return await query.find().then(results => {
            return results
        }).catch(error => {
            throw(error)
        })
    },
    saveAll:async function(entities) {
        return await Parse.Object.saveAll(entities).then(() => { 
            return
        }).catch(error => {
            throw(error)
        })
    }
}