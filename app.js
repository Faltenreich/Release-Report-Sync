global.include = function(file) {
    const path = __dirname + '/' + file
    return require(path);
}

const Sync = include('sync')

module.exports = {
    start:function() {
        Sync.start()
    }
}