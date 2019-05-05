const Parse = require('parse/node')

module.exports = {
    save:function(entity) {
        return new Promise(function(resolve, _) {
            entity.save()
            resolve()
        })
    },
    saveConfirmed:function(entity) {
        return new Promise(function(resolve, reject) {
            entity.save().then((entity) => { 
                resolve(entity)
            }, (error) => { 
                console.log(error)
                reject()
            })
        })
    },
    saveAll:function(entities) {
        return new Promise(function(resolve, reject) {
            Parse.Object.saveAll(entities).then(() => { 
                resolve()
            }, (error) => { 
                console.log(error)
                reject()
            })
        })
    },
    getByExternalId:function(id, type) {
        return new Promise(function(resolve, reject) {
            const query = new Parse.Query(type)
            query.equalTo("externalId", id)
            query.find().then(function(results) {
                if (results.length > 0) {
                    const result = results[0]
                    resolve(result)
                } else {
                    resolve(null)
                }
            }, function(error) {
                console.log(error)
                reject(error)
            })
        })
    }
}