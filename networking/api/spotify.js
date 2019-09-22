const HOST = "https://api.spotify.com/v1"
const API_KEY = "MGM0NjM5NWZlYmIxNGQ3MTlhMTYxOWU2ZDFiM2RjZWM6Njg3ODBhYzAwYzU2NGU5MGI3Y2Q4OWY1YWNiOWUwNDU="

const SPOTIFY_PAGE_SIZE = 20

global.ID_PREFIX_SPOTIFY = "spotify_"

module.exports = {
    token:function() {
        // Different API
        return {
            "method": "POST",
            "url": "https://accounts.spotify.com/api/token",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${API_KEY}`
            },
            "body": "grant_type=client_credentials"
        }
    },
    browse:function(page, token) {
        return getRequest({
            "endpoint": "/browse/new-releases",
            "params": `?offset=${page * SPOTIFY_PAGE_SIZE}&limit=${SPOTIFY_PAGE_SIZE}`,
            "token": token
        })
    },
    albums:function(ids, token) { // Accepts 20 ids at most
        const commaSeparatedIds = ids.join(",")
        return getRequest({
            "endpoint": "/albums",
            "params": `?ids=${commaSeparatedIds}`,
            "token": token
        })
    }
}

function getRequest(params) {
    return { 
        "method": "GET",
        "url": HOST + params.endpoint + params.params,
        "headers": {
            "Authorization": `Bearer ${params.token}`
        }
    }
}