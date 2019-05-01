const Parse = require('parse/node')

module.exports = {
    save:function(entity) {
        return new Promise(function(resolve, reject) {
            entity.save().then((release) => { 
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
                reject(error)
            })
        })
    }
}