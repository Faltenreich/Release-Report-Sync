const DateUtils = include('util/date')

const HOST = "https://api.themoviedb.org/3"
const API_KEY = "3f49b57b1f30fc4de49d48e7d4a92d6f"

global.ID_PREFIX_MOVIEDB = "moviedb_"

module.exports = {
    genres:function(language) {
        return getRequest({
            "endpoint": "/genre/movie/list",
            "params": "?",
            "language": language
        })
    },
    discover:function(language, minDate, maxDate, page) {
        return getRequest({
            "endpoint": "/discover/movie",
            "params": `?primary_release_date.gte=${DateUtils.formatDate(minDate)}` +
                `&primary_release_date.lte=${DateUtils.formatDate(maxDate)}` +
                `&sort_by=popularity.desc&page=${page}` +
                `&vote_count.gte=1` +
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