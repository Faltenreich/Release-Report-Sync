const DateUtils = include('util/date')

const HOST = "https://api-v3.igdb.com"
const API_KEY = "c1decb1caa42a8c40ad4586a56e1a017"
const MAX_PAGE_SIZE = 50

global.ID_PREFIX_IGDB = "igdb_"

module.exports = {
    games:function(date, page) {
        return getRequest({
            "endpoint": "/games",
            "params": `fields *, cover.*, screenshots.*; where first_release_date > ${DateUtils.convertToMillis(date)}; sort popularity desc; limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`
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
        "url": HOST + params.endpoint,
        "headers": { "user-key": API_KEY, "content-type": "application/raw" },
        "body": params.params
    }
}