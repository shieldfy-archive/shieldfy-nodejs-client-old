var Hook = require('require-in-the-middle');
var shimmer = require('shimmer');
var path = require('path');
var Request = require('./request');
var async_hooks = require('./instrumentation/async_hooks')


function Session ()
{
    this._hook = null;
}

Session.prototype.start = function(Client)
{
    // start instrumentation
    
    var self = this;

    async_hooks(Client);

    var x = function() { console.log('called x'); }
    
    this._hook = Hook(['http'], function (exports, name, basedir) {
      x();
        if (basedir) {
          var pkg = path.join(basedir, 'package.json')
          try {
            var version = require(pkg).version
            //version = JSON.parse(fs.readFileSync(pkg)).version
          } catch (e) {
           // Client.logger('Couldnt determine version');
          }
        } else {
          version = process.versions.node
        }

       
        return self._proxy(Client,exports, name, version);

    });

}

Session.prototype._proxy = function(Client,exports,module, version){
 
  Client.logger('Patching Module ' + module + '@' + version);
  shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
      return function (event, req, res) {        
          if (event === 'request') {
            //console.log('actual request')
            Client._currentRequest = new Request(req);
            //Client._currentRequest.setReq(req);            
          }

          var returned = original.apply(this, arguments)
          //console.log("Done setting up request -- OH YEAH!");
          return returned;
      };
  });

  shimmer.wrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, 'writeHead', function (original) {
    return function () {
        var returned = original.apply(this, arguments)
        //process._rawDebug('HTTP ' + (this.statusCode || '').toString()[0] + 'xx');
        Client._currentRequest.end();
        //console.log("Done setting up request -- OH YEAH!");
        return returned;
    };
  });

  return exports;
}



module.exports = new Session;