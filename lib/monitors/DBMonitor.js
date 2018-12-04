var shimmer = require('shimmer');
var requestCollector = require('../collectors/requestCollector')

function DBMonitor()
{
    this._client = null;
}

DBMonitor.prototype.run = function(Client, Instrumentation)
{
    Instrumentation.register('mysql',this.handleRequest);   
}


DBMonitor.prototype.handleRequest = function(Client,exports, name, version)
{
    process._rawDebug('REQUEST2 ==> '  + 'mysql');
    
    process._rawDebug(exports);

    shimmer.wrap(exports, 'createConnection',function(original){

        Client._monitorBase.MonitorName('request')

        return function (query , callback) { 
            var connection = original.apply(this, arguments);

            shimmer.wrap(connection, 'query',function(original){
                return function (query , callback) { 
                    console.log('#########################################################################################')

                    console.log(query)
                    var rr = Client._jury.use('request').judge(query);
                        if (rr) {
                            var severity = Client._monitorBase.parseScore(rr.score)
                            console.log('=======================================> '+severity)
                            Client._monitorBase.sendToJail(severity)
                        }

                    console.log('#########################################################################################')
                    return original.apply(this, arguments)
                }
            });

            return connection;
        }
    })

    return exports;
}

module.exports = new DBMonitor();