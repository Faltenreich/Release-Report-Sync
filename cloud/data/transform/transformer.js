const Calendar = include('data/transform/calendar')

module.exports = {
    start:async function(language, region, minDate, maxDate) {
        await Calendar.update(language, region, minDate, maxDate)
    }
}