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
    Client._monitorBase.MonitorName('db')

    process._rawDebug('REQUEST2 ==> '  + 'mysql');
    process._rawDebug(exports);

    shimmer.wrap(exports, 'createPool',function(original){
        return function (query , callback) { 
            var connection = original.apply(this, arguments);
            wrapQuery(Client, connection)
            return connection;
        }
    })

    shimmer.wrap(exports, 'createPoolCluster',function(original){
        return function (query , callback) { 
            var connection = original.apply(this, arguments);
            wrapQuery(Client, connection)
            return connection;
        }
    })

    shimmer.wrap(exports, 'createConnection',function(original){
        return function (query , callback) { 
            var connection = original.apply(this, arguments);
            wrapQuery(Client, connection)
            return connection;
        }
    })

    return exports;
}


function wrapQuery(Client, connection)
{
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
}

module.exports = new DBMonitor();