var Hook = require('require-in-the-middle');
var shimmer = require('shimmer');
var path = require('path');
var Request = require('./request');
var async_hooks = require('./instrumentation/async_hooks')
var endOfStream = require('end-of-stream')


function Session ()
{
    this._hook = null;
}

Session.prototype.start = function(Client)
{
    // start instrumentation
    
    var self = this;

    async_hooks(Client);


    
    this._hook = Hook(['http'], function (exports, name, basedir) {
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

            endOfStream(res, function (err) {
              //console.log(res);
              console.log('FINISHED')  
              
            });
            //Client._currentRequest.setReq(req);            
          }

          var returned = original.apply(this, arguments)
          //console.log("Done setting up request -- OH YEAH!");
          return returned;
      };
  });

  /*  IDEA : save the response : write after write 
    Then : when block is there replace the  */
  shimmer.wrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, 'end', function (original) {
    return function () {
        console.log('first');
       // console.log('ooooo' , this.output);
       // console.log(arguments);
        //var cb = arguments[0];
         arguments[0] = 'Alternative Response';
        // arguments[1] = 'utf8';
        // arguments[2] = cb;
      //  console.log(arguments);
        // this.output = [];
        // this.outputSize += 'KEKE'.length;
        
        var returned = original.apply(this, arguments)
       // return true;
        //process._rawDebug('HTTP ' + (this.statusCode || '').toString()[0] + 'xx');
        Client._currentRequest.end();
        //console.log("Done setting up request -- OH YEAH!");
        return returned;
    };
  });


  return exports;
}



module.exports = new Session;