var uuid = require('uuid');
/**
 * 
 * @constructor
 * @param {object} req 
 */
function userCollector(req)
{

    this.ip = req ? this.getIp(req):'',
    this.id = uuid.v4(),
    this.userAgent = req ? this.getUserAgent(req) : '';
}

userCollector.prototype.getIp = function(req)
{
    try {
        if (req.headers === undefined){
            throw "request does not has a headers"
        }else{
            var xff = req.headers['x-forwarded-for'];
        }
    
        var ip = req.connection.remoteAddress;
    
        if (xff) {
            if (xff != ip) {
                return ip;
            }
        }
        return ip;
    } catch(e) {
        // console.log(e)
    }
}

userCollector.prototype.getUserAgent = function(req)
{
    try {
        if (req.headers === undefined){
            throw "request does not has a headers"
        }else{
            return req.headers['user-agent'];
        }
    } catch(e) {
        // console.log(e)
    }
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