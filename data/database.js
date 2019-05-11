const Parse = require('parse/node')

module.exports = {
    getByExternalId:async function(id, type) {
        const query = new Parse.Query(type)
        query.equalTo("externalId", id)
        return await query.find().then(results => {
            if (results.length > 0) {
                const result = results[0]
                return result
            } else {
                return null
            }
        }).catch(error => {
            console.log(error)
            throw(error)
        })
    },
    getByExternalIds:async function(ids, type) {
        const query = new Parse.Query(type)
        query.containedIn("externalId", ids)
        return await query.find().then(results => {
            return results
        }).catch(error => {
            console.log(error)
            throw(error)
        })
    },
    saveAll:async function(entities) {
        return await Parse.Object.saveAll(entities).then(() => { 
            return
        }).catch(error => {
            console.log(error)
            throw(error)
        })
    }
}