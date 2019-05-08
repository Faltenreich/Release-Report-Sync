const HOST = "https://api.themoviedb.org/3"
const API_KEY = "3f49b57b1f30fc4de49d48e7d4a92d6f"

module.exports = {
    genres:function(language) {
        const endpoint = "/genre/movie/list"
        const params = `?language=${language}&api_key=${API_KEY}`
        const url = HOST + endpoint + params
        return { "url": url }
    },
    discover:function(year, page, language) {
        const endpoint = "/discover/movie"
        const params = `?primary_release_year=${year}&sort_by=popularity.desc&language=${language}&page=${page}&api_key=${API_KEY}`
        const url = HOST + endpoint + params
        return { "url": url }
    }
}