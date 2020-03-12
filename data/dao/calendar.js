const Parse = require('parse/node')
const Calendar = Parse.Object.extend("Calendar")

module.exports = {
    deleteBetween:async function(minDate, maxDate) {
        const query = new Parse.Query(Calendar)
        query.greaterThanOrEqualTo('date', minDate)
        query.lessThan('date', maxDate)
        await query.find().then(function(results) {
            return Parse.Object.destroyAll(results);
        }).then(function() {
            return
        }, function(error) {
            console.log(error)
            return
        });
    }
}