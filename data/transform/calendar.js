const Parse = require('parse/node')

const Database = include('data/database')
const Release = Parse.Object.extend("Release")
const Calendar = Parse.Object.extend("Calendar")

module.exports = {
    update:async function(language, region, minDate, maxDate) {
        console.log(`Starting calendar update`)
        const releasesByDate = await Database.getDistinct(Release, "releasedAt")

        var calendarItems = []
        for (var date = minDate; date <= maxDate; date.setDate(date.getDate() + 1)) {
            let releaseForDate = releasesByDate.find(release => {
                const releaseDate = release.get("releasedAt")
                return releaseDate.getDate() == date.getDate()
                    && releaseDate.getMonth() == date.getMonth()
                    && releaseDate.getFullYear() == date.getFullYear()
            })
            if (releaseForDate) {
                calendarItems.push(releaseForDate)
            }
        }
        
        // TODO: Create and update calendar items

        console.log(`Completed calendar update`)
    }
}