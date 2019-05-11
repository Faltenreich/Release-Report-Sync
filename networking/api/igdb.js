const HOST = "https://api-endpoint.igdb.com"
const API_KEY = "f3bf94eebc26b08c15b707c5d89d2ce3"
const MAX_PAGE_SIZE = 20

global.ID_PREFIX_IGDB = "igdb_"

module.exports = {
    games:function(language, year, page) {
        return getRequest({
            "endpoint": "/games/",
            "params": `?fields=*&filter[first_release_date][gt]=${year}-01-01&order=release_dates.date%3Aasc&limit=${MAX_PAGE_SIZE}&offset=${page * MAX_PAGE_SIZE}`,
            "language": language
        })
    }
}

function getRequest(params) {
    return {
        "url": HOST + params.endpoint + params.params,
        "headers": { "user-key": API_KEY }
    }
}