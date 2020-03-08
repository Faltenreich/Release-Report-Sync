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
                const isSameDay = releaseDate.getDate() == date.getDate()
                    && releaseDate.getMonth() == date.getMonth()
                    && releaseDate.getFullYear() == date.getFullYear()
                return isSameDay
            })
            if (releaseForDate) {
                const calendarItem = new Calendar()
                calendarItem.set("date", releaseForDate.get("releasedAt"))
                calendarItem.set("releaseId", releaseForDate.get("externalId"))
                calendarItems.push(calendarItem)
            }
        }

        Database.saveAll(calendarItems)

        console.log(`Completed calendar update`)
    }
}