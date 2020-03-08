module.exports = {
    convertToMillis:function(date) {
        return Math.floor(date.getTime() / 1000)
    },
    // Formats date as yyyy-MM-dd
    formatDate:function(date) {
        const parts = [
            date.getFullYear(),
            ('0' + (date.getMonth() + 1)).slice(-2),
            ('0' + date.getDate()).slice(-2)
        ]
        const format = parts.join('-')
        return format
    },
    monthsBetween:function(from, to) {
        return to.getMonth() - from.getMonth() + (12 * (to.getFullYear() - from.getFullYear()))
    }
}