const Config = include('config').igdb
const DateUtils = include('util/date')

const HOST = "https://api.igdb.com/v4"
const CLIENT_ID = Config.clientId
const CLIENT_SECRET = Config.clientSecret
const MAX_PAGE_SIZE = 50

global.ID_PREFIX_IGDB = "igdb_"

module.exports = {
    authenticate:function() {
        return {
            "method": "POST",
            "url": `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
        }
    },
    games:function(accessToken, minDate, maxDate, page) {
        const minDateInMillis = DateUtils.convertToMillis(minDate)
        const maxDateInMillis = DateUtils.convertToMillis(maxDate)
        return getRequest({
            "accessToken": accessToken,
            "endpoint": "/games",
            "params": `fields *, cover.*, screenshots.*, videos.*, involved_companies.*, involved_companies.company.name; ` +
                `where first_release_date > ${minDateInMillis} &` +
                `first_release_date < ${maxDateInMillis}; ` +
                `limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`
        })
    },
    genres:function(accessToken, page) {
        return getRequest({
            "accessToken": accessToken,
            "endpoint": "/genres",
            "params": `fields name; limit ${MAX_PAGE_SIZE}; offset ${page * MAX_PAGE_SIZE};`
        })
    },
    platforms:function(accessToken, page) {
        return getRequest({
            "accessToken": accessToken,
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
            "Authorization": `Bearer ${params.accessToken}`
         },
        "body": params.params
    }
}