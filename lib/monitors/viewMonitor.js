var shimmer = require('shimmer');

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

    shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
        return function (event, req, res) {        
            if (event === 'request') {
                console.log('viewmonitor: handling request '+ Client._currentRequest._id);
            }
            var returned = original.apply(this, arguments);
            return returned;
        };
    });
    
    return exports;
}

module.exports = new viewMonitor();