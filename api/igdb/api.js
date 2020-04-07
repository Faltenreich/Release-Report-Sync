const Config = include('config').igdb
const DateUtils = include('util/date')

const HOST = Config.serverUrl
const API_KEY = Config.apiKey
const MAX_PAGE_SIZE = Config.pageSize

global.ID_PREFIX_IGDB = "igdb_"

module.exports = {
    games:function(minDate, maxDate, page) {
        const minDateInMillis = DateUtils.convertToMillis(minDate)
        const maxDateInMillis = DateUtils.convertToMillis(maxDate)
        return getRequest({
            "endpoint": "/games",
            "params": `fields *, cover.*, screenshots.*, videos.*, involved_companies.*, involved_companies.company.name; ` +
                `where first_release_date > ${minDateInMillis} &` +
                `first_release_date < ${maxDateInMillis} &` +
                `popularity > 1; ` +
                `sort popularity desc; ` +
                `limit ${MAX_PAGE_SIZE}; offset ${page * Config.pageSize};`
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
            "user-key": API_KEY, 
            "content-type": "application/raw",
            "Access-Control-Allow-Origin": "*"
         },
        "body": params.params
    }
}