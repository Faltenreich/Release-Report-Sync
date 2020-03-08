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
    const minDateForPage = new Date(minDate)
    minDateForPage.setMonth(minDate.getMonth() + page * CALENDAR_PAGE_SIZE)

    const maxDateForPage = new Date(minDateForPage)
    maxDateForPage.setMonth(minDateForPage.getMonth() + CALENDAR_PAGE_SIZE)

    const releasesByDate = await ReleaseDao.getByDate(minDateForPage, maxDateForPage)

    var calendarItems = []
    for (var date = new Date(minDateForPage); date <= maxDateForPage; date.setDate(date.getDate() + 1)) {
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

    await Database.saveAll(calendarItems)
    
    const nextPage = page + 1
    console.log(`Updated calendar: page ${nextPage} of ${pageCount}`)
    
    const loadMore = nextPage < pageCount
    if (loadMore) {
        await updateCalendarBetween(minDate, maxDate, page + 1, pageCount)
    }
}