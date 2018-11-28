var uuid = require('uuid');
/**
 * 
 * @constructor
 * @param {object} req 
 */
function userCollector(req)
{
    this.ip = this.getIp(req),
    this.userAgent = req.headers['user-agent'],
    this.id = uuid.v4();
}

userCollector.prototype.getIp = function(req)
{
    var xff = req.headers['x-forwarded-for'],
        ip = req.connection.remoteAddress;

    if (xff) {
        if (xff != ip) {
            return ip;
        }
    }
    return ip;
}

/**
 * @param {number} score
 */
userCollector.prototype.setScore = function(score)
{
    this.score=score;
}

/**
 * 
 * @returns {number}
 */
userCollector.prototype.getScore = function()
{
    return this.score;
}

/**
 * 
 * @return {object}
 */
userCollector.prototype.getInfo = function()
{
    return {
        id : this.id,
        ip : this.ip,
        userAgent : this.userAgent,
        score : this.score
    }
}

module.exports = userCollector;