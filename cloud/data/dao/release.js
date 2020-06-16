const Parse = require('parse/node')
const Release = Parse.Object.extend("Release")

module.exports = {
    getByDate:async function(minDate, maxDate) {
        const query = new Parse.Query(Release)
        query.greaterThanOrEqualTo('releasedAt', minDate)
        query.lessThan('releasedAt', maxDate)
        query.ascending('releasedAt')
        query.addDescending('popularity')
        query.distinct('releasedAt')
        return await query.find().then(results => {
            return results
        }).catch(error => {
            console.log(error)
            throw(error)
        })
    }
}