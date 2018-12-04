var crypto = require('crypto');

function MonitorBase(client)
{
    this._name = null
    this._getReq = null
    this.api = client._http._api
    this.config = client._config;
    // this.userCollector = userCollector
}

MonitorBase.prototype.sendToJail = function(severity = 'low', charge = [], code = [])
{
    var incidentId = this.generateIncidentId(12)

    if (severity == 'high') {

        var getInfo = this._getReq._user.getInfo()
        var getProtectedinfo = this._getReq.getProtectedinfo()

        this.api.trigger('session/threat', {
            incidentId: incidentId,
            host: getProtectedinfo.url.hostname,
            sessionId: 1,
            user: {
                id: getInfo.id,
                ip: getInfo.ip,
                // userAgent: getInfo.userAgent,
                score: getInfo.score || 0,
            },
            monitor: this._name,
            severity: severity,
            charge: charge,
            request: {
                method: getProtectedinfo.method,
                url: getProtectedinfo.url,
                query: getProtectedinfo.query,
            },
            code: code,
            response: (severity == 'high' && this.config.action == 'block') ? 'block' : 'pass'
        });
    }
}

MonitorBase.prototype.parseScore = function(score = 0)
{
    if (score >= 70) {
        return 'high';
    }
    if (score >= 40) {
        return 'med';
    }
    return 'low';
}

MonitorBase.prototype.generateIncidentId = function(userId)
{
    return crypto.createHash('md5').update('_'+userId+this.mt_rand()).digest("hex")
}

MonitorBase.prototype.mt_rand = function(min, max) {
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


MonitorBase.prototype.MonitorName = function(name)
{
    this._name = name
}

MonitorBase.prototype.getReq = function(req)
{
    this._getReq = req
}

module.exports = MonitorBase;