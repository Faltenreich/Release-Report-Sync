module.exports = {
    sleep:async function(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
}