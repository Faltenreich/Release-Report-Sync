const Config = include('config').movieDb
const DateUtils = include('util/date')

const HOST = Config.serverUrl
const API_KEY = Config.apiKey

global.ID_PREFIX_MOVIEDB = "moviedb_"

module.exports = {
    genres:function(language) {
        return getRequest({
            "endpoint": "/genre/movie/list",
            "params": "?",
            "language": language
        })
    },
    discover:function(language, region, minDate, maxDate, page) {
        return getRequest({
            "endpoint": "/discover/movie",
            "params": `?primary_release_date.gte=${DateUtils.formatDate(minDate)}` +
                `&primary_release_date.lte=${DateUtils.formatDate(maxDate)}` +
                `&sort_by=popularity.desc&page=${page}` +
                `&region=${region}` +
                `&`,
            "language": language
        })
    }
}

function getRequest(params) {
    return { 
        "method": "GET",
        "url": HOST + params.endpoint + params.params + `language=${params.language}&api_key=${API_KEY}`
    }
}