const Parse = require('parse/node')

module.exports = {
    save:function(entity, callback) {
        entity.save().then((release) => { 
            callback()
        }, (error) => { 
            console.log(error)
            callback()
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
                reject(error)
            })
        })
    }
}