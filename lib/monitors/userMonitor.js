var shimmer = require('shimmer');
var requestCollector = require('../collectors/requestCollector')

function UserMonitor()
{
    this._client = null;
}

UserMonitor.prototype.run = function(Client, Instrumentation)
{
    Instrumentation.register('http',this.handleRequest);   
}


UserMonitor.prototype.handleRequest = function(Client,exports, name, version)
{
    process._rawDebug('REQUEST2 ==> '  + 'xx ');
    
    process._rawDebug(exports && exports.Server && exports.Server.prototype);

    shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
        return function (event, req, res) { 
            Client._monitorBase.MonitorName('request')
                 
            if (event === 'request') {
                new requestCollector(Client._currentRequestObj,null,function(data){
                    Client._monitorBase.getReq(data)
                    score = data._user.getScore()
                    if (score) {
                        Client._monitorBase.sendToJail(Client._monitorBase.parseScore(score))
                    }
                })
                    
                res.on('finish',function(){    
                  //  console.log(Client._currentRequest.getRes()._header);
                });
            }

            
            var returned = original.apply(this, arguments);
            return returned;
        };
    });

    return exports;
}

module.exports = new UserMonitor();