module.exports = {
    sleep:async function(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    formatDate:function(date) {
        const parts = [
            date.getFullYear(),
            ('0' + (date.getMonth() + 1)).slice(-2),
            ('0' + date.getDate()).slice(-2)
        ]
        const format = parts.join('-')
        return format
    }
}