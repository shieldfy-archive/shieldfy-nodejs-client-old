var crypto = require('crypto');
var userCollector = require('../collectors/userCollector')

function MonitorBase(client)
{
    this._getReq = null
    this.api = client._http._api
    this.userCollector = new userCollector(this._getReq)
}

MonitorBase.prototype.sendToJail = function(severity = 'low', charge = [], code = [])
{
    console.log(this.userCollector.getInfo())
    var incidentId = this.generateIncidentId(12)

    if (severity == 'high') {
        this.api.trigger('session/threat', {
            incidentId: incidentId,
            host: 'nodeJs',
            sessionId: 'nodeJs',
            // user: this.userCollector,
            monitor: 'nodeJs',
            severity: 'nodeJs',
            charge: charge,
            request: 'nodeJs',
            code: code,
            response: 'nodeJs'
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

MonitorBase.prototype.getReq = function(req)
{
    this._getReq = req
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

module.exports = MonitorBase;