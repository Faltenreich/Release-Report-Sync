const HOST = "https://api-v3.igdb.com"
const API_KEY = "c1decb1caa42a8c40ad4586a56e1a017"
const MAX_PAGE_SIZE = 50

global.ID_PREFIX_IGDB = "igdb_"

module.exports = {
    games:function(language, date, page) {
        // TODO: Specify required fields
        const millis = Math.floor(date.getTime() / 1000)
        return getRequest({
            "endpoint": "/games",
            "params": `fields *, cover.*, screenshots.*, platforms.*, genres.*; where first_release_date > ${millis}; sort popularity desc; limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`,
            "language": language
        })
    }
}

function getRequest(params) {s
    // IGDB is currently not localized
    return {
        "url": HOST + params.endpoint,
        "headers": { "user-key": API_KEY, "content-type": "application/raw" },
        "body": params.params
    }
}