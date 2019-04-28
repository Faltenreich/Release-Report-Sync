const Parse = require('parse/node')

module.exports = {
    save:function(entity, callback) {
        entity.save().then((release) => { 
            callback()
        }, (error) => { 
            console.log(error)
            callback()
        })
    }
}