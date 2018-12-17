var crypto = require('crypto');

module.exports = function()
{
    var userId = 12;
    var d = new Date();
    return crypto.createHash('md5').update('_'+userId+mt_rand()+d.getSeconds()).digest("hex");
}

var mt_rand = function(min, max) {
    var argc = arguments.length
    if (argc === 0) {
        min = 0
        max = 2147483647
    } else if (argc === 1) {
        throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given')
    } else {
        min = parseInt(min, 10)
        max = parseInt(max, 10)
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}