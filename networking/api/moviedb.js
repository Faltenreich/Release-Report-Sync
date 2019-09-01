const Utils = include('utils')

const HOST = "https://api.themoviedb.org/3"
const API_KEY = "3f49b57b1f30fc4de49d48e7d4a92d6f"

global.ID_PREFIX_MOVIEDB = "moviedb_"

module.exports = {
    genres:function(language) {
        // TODO: Specify required fields
        return getRequest({
            "endpoint": "/genre/movie/list",
            "params": "?",
            "language": language
        })
    },
    discover:function(language, minDate, maxDate, page) {
        return getRequest({
            "endpoint": "/discover/movie",
            "params": `?primary_release_date.gte=${Utils.formatDate(minDate)}&primary_release_date.lte=${Utils.formatDate(maxDate)}&sort_by=popularity.desc&vote_count.gte=1&page=${page}&`,
            "language": language
        })
    }
}

function getRequest(params) {
    return { 
        "url": HOST + params.endpoint + params.params + `language=${params.language}&api_key=${API_KEY}`
    }
}