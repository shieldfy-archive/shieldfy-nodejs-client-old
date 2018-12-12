var shimmer = require('shimmer');
var requestCollector = require('../collectors/requestCollector')
//var jury = require('jury').issue('view');


function viewMonitor()
{
    this._client = null;
}

viewMonitor.prototype.run = function(Client,Instrumentation)
{
    console.log('viewmonitor: register http listener ');
    Instrumentation.register('http',this.handleRequest);   
}


viewMonitor.prototype.handleRequest = function(Client,exports, name, version)
{

    // shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
    //     return function (event, req, res) {                    
    //         if (event === 'request') {
    //             console.log(res);
    //             console.log('viewmonitor: handling request '+ Client._currentRequest._id);
    //         }
    //         var returned = original.apply(this, arguments);
    //         return returned;
    //     };
    // });

    shimmer.wrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, 'write', function (original) {
        return function () {
            Client._monitorBase.MonitorName('view');

            new requestCollector(Client._currentRequestObj,function(data){
                Client._monitorBase.getReq(data);
            });

            var rr = Client._jury.use('request').judge(arguments[0]);
            if (rr) {
                var severity = Client._monitorBase.parseScore(rr.score);
                Client._monitorBase.sendToJail(severity);
            }
            
            //Client._currentRequest.end();
            var returned = original.apply(this, arguments);
            return returned;
        }
    });
    
    return exports;
}

module.exports = new viewMonitor();