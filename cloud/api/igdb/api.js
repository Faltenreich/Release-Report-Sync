const Config = include('config').igdb
const DateUtils = include('util/date')

const HOST = "https://api.igdb.com/v4"
const CLIENT_ID = Config.clientId
const API_KEY = Config.apiKey
const MAX_PAGE_SIZE = 50

global.ID_PREFIX_IGDB = "igdb_"

module.exports = {
    games:function(minDate, maxDate, page) {
        const minDateInMillis = DateUtils.convertToMillis(minDate)
        const maxDateInMillis = DateUtils.convertToMillis(maxDate)
        return getRequest({
            "endpoint": "/games",
            "params": `fields *, cover.*, screenshots.*, videos.*, involved_companies.*, involved_companies.company.name; ` +
                `where first_release_date > ${minDateInMillis} &` +
                `first_release_date < ${maxDateInMillis}; ` +
                `limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`
        })
    },
    genres:function(page) {
        return getRequest({
            "endpoint": "/genres",
            "params": `fields name; limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`
        })
    },
    platforms:function(page) {
        return getRequest({
            "endpoint": "/platforms",
            "params": `fields name; limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`
        })
    }
}

function getRequest(params) {
    return {
        "method": "POST",
        "url": HOST + params.endpoint,
        "headers": { 
            "Client-ID": CLIENT_ID,
            "Authorization": `Bearer ${API_KEY}` // TODO: Replace with token from Twitter
         },
        "body": params.params
    }
}