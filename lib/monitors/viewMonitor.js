var shimmer = require('shimmer');
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
            console.log('sec');
            process._rawDebug('HTTP ' + (this.statusCode || '').toString()[0] + 'xx ' + Client._currentRequest._id);

            //console.log(arguments);

            var returned = original.apply(this, arguments);
            //process._rawDebug('HTTP ' + (this.statusCode || '').toString()[0] + 'xx');
            //Client._currentRequest.end();
            //console.log("Done setting up request -- OH YEAH!");
            return returned;
        };
    });
    
    return exports;
}

module.exports = new viewMonitor();