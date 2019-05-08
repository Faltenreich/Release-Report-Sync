const Parse = require('parse/node')

module.exports = {
    getByExternalId:function(id, type) {
        return new Promise(function(resolve, reject) {
            const query = new Parse.Query(type)
            query.equalTo("externalId", id)
            query.find().then(results => {
                if (results.length > 0) {
                    const result = results[0]
                    resolve(result)
                } else {
                    resolve(null)
                }
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    getByExternalIds:function(ids, type) {
        return new Promise(function(resolve, reject) {
            const query = new Parse.Query(type)
            query.containedIn("externalId", ids)
            query.find().then(results => {
                resolve(results)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    saveAll:function(entities) {
        return new Promise(function(resolve, reject) {
            Parse.Object.saveAll(entities).then(() => { 
                resolve()
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }
}