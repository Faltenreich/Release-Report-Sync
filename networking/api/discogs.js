const HOST = "https://api.discogs.com"
const API_KEY = "oBXMVXDFZTwJxMdWXLqOajkMZsGYBvtMBHxvtpbd"

global.ID_PREFIX_DISCOGS = "discogs_"

module.exports = {
    search:function(year, page) {
        return getRequest({
            "endpoint": "/database/search",
            "params": `?year=${year}&format=album&type=release&`
        })
    },
    getRelease:function(id) {
        return getRequest({
            "endpoint": `/releases/${id}`,
            "params": "?"
        })
    }
}

function getRequest(params) {
    return { 
        "method": "GET",
        "url": HOST + params.endpoint + params.params + `token=${API_KEY}`
    }
}