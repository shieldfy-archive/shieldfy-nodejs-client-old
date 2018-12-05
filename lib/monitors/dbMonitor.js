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
    Instrumentation.register('mongodb-core', this.handleMongodb)
}


DBMonitor.prototype.handleMysql = function(Client, exports, name, version)
{

    process._rawDebug('REQUEST ==> '  + 'mysql');
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

    process._rawDebug('REQUEST ==> '  + 'mysql2');
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

// DBMonitor.prototype.handleMongodb = function(Client, exports, name, version)
// {

//     process._rawDebug('REQUEST ==> '  + 'mongodb');
//     // process._rawDebug(exports);

//     shimmer.wrap(exports.Server.prototype, 'command', function(original){
//         return function (query , callback) { 
//             var connection = original.apply(this, arguments);
            

//             console.log(query)
            
//             // wrapCommand(Client, original)


//             return connection;
//         }
//     })


//     shimmer.massWrap(exports.Server.prototype, ['insert', 'update', 'remove', 'auth'], function(original){
//         return function (query , callback) { 
//             var connection = original.apply(this, arguments);
            

//             console.log(query)
            
//             // wrapCommand(Client, original)


//             return connection;
//         }
//     })

//     return exports;
// }



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