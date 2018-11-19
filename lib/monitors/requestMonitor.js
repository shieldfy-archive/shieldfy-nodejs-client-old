var shimmer = require('shimmer');


function requestMonitor()
{
    this._client = null;
}

requestMonitor.prototype.run = function(Client,Instrumentation)
{
    process._rawDebug('REQUEST1 ==> '  + 'xx ');
    Instrumentation.register('http',this.handleRequest);   
}


requestMonitor.prototype.handleRequest = function(Client,exports, name, version)
{
    process._rawDebug('REQUEST2 ==> '  + 'xx ');
    
    shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
        return function (event, req, res) {  
            //console.log(arguments);                  
            if (event === 'request') {
                //console.log(res);
                //console.log('Request Monitor: handling request '+ Client._currentRequest._id);
                process._rawDebug('REQUEST3 ==> '  + 'xx ');
            }
            var returned = original.apply(this, arguments);
            return returned;
        };
    });

    return exports;
}

module.exports = new requestMonitor();