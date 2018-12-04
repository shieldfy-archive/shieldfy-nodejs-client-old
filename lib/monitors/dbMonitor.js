var shimmer = require('shimmer');
var requestCollector = require('../collectors/requestCollector')

function DBMonitor()
{
    this._client = null;
}

DBMonitor.prototype.run = function(Client, Instrumentation)
{
    Client._monitorBase.MonitorName('db')
    Instrumentation.register('mysql', this.handleMysql)
    Instrumentation.register('mysql2', this.handleMysql2)
}


DBMonitor.prototype.handleMysql = function(Client, exports, name, version)
{

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

DBMonitor.prototype.handleMysql2 = function(Client, exports, name, version)
{

    process._rawDebug('REQUEST2 ==> '  + 'mysql2');
    process._rawDebug(exports);

    shimmer.wrap(exports, 'createConnection', function(original){
        return function (query , callback) { 
            var connection = original.apply(this, arguments);
            wrapQuery(Client, connection)
            wrapExecute(Client, connection)
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

function wrapExecute(Client, connection)
{
    shimmer.wrap(connection, 'execute',function(original){
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