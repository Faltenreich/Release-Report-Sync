const HOST = "https://api.spotify.com/v1"
const API_KEY = "MGM0NjM5NWZlYmIxNGQ3MTlhMTYxOWU2ZDFiM2RjZWM6Njg3ODBhYzAwYzU2NGU5MGI3Y2Q4OWY1YWNiOWUwNDU="

const SPOTIFY_PAGE_SIZE = 50

global.ID_PREFIX_MOVIEDB = "spotify_"

module.exports = {
    token:function() {
        return {
            "method": "POST",
            "url": "https://accounts.spotify.com/api/token",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${API_KEY}`
            },
            "body": "grant_type=client_credentials"
        }
    }
}