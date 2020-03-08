const Parse = require('parse/node')

const Database = include('data/database')
const ReleaseDao = include('data/dao/release')
const Calendar = Parse.Object.extend("Calendar")

const DateUtils = include('util/date')

// We do not fetch more than three months at a time in order to stay within the 100-item result limit
const CALENDAR_PAGE_SIZE = 3

module.exports = {
    update:async function(language, region, minDate, maxDate) {
        console.log(`Starting calendar update`)
        const monthsBetween = DateUtils.monthsBetween(minDate, maxDate)
        const pageCount = monthsBetween / CALENDAR_PAGE_SIZE
        await updateCalendarBetween(minDate, maxDate, 0, pageCount)
        console.log(`Completed calendar update`)
    }
}

async function updateCalendarBetween(minDate, maxDate, page, pageCount) {
    console.log(`Updating calendar: page ${page + 1} of ${pageCount}`)

    const minDateForPage = new Date()
    minDateForPage.setDate(minDate.getDate())
    minDateForPage.setMonth(minDate.getMonth() + page * CALENDAR_PAGE_SIZE)
    minDateForPage.setFullYear(minDate.getFullYear())

    const maxDateForPage = new Date()
    maxDateForPage.setDate(minDateForPage.getDate())
    maxDateForPage.setMonth(minDateForPage.getMonth() + CALENDAR_PAGE_SIZE)
    maxDateForPage.setFullYear(minDateForPage.getFullYear())

    const releasesByDate = await ReleaseDao.getByDate(minDateForPage, maxDateForPage)

    var calendarItems = []
    var currentDate = new Date()
    currentDate.setDate(minDateForPage.getDate())
    currentDate.setMonth(minDateForPage.getMonth())
    currentDate.setFullYear(minDateForPage.getFullYear())
    for (currentDate = minDateForPage; currentDate <= maxDateForPage; currentDate.setDate(currentDate.getDate() + 1)) {
        let releaseForDate = releasesByDate.find(release => {
            const releaseDate = release.get("releasedAt")
            const isSameDay = releaseDate.getDate() == currentDate.getDate()
                && releaseDate.getMonth() == currentDate.getMonth()
                && releaseDate.getFullYear() == currentDate.getFullYear()
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
    
    if (page < pageCount) {
        await updateCalendarBetween(minDate, maxDate, page + 1, pageCount)
    }
}