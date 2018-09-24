var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


function Storage(config = Array) {
    if ( config.option == 'default' ) {
        this.saveTo = localStorage;
    } else {
        this.saveTo = config.device;
    }
}

Storage.prototype.set = function(key, value)
{
    this.saveTo.setItem(key, value);
}

Storage.prototype.get = function(key)
{
    return this.saveTo.getItem(key);
}

Storage.prototype.has = function(key)
{
    if ( fs.existsSync('./scratch/' + key) ) {
        return true;
    }
    return false;
}

module.exports = Storage;