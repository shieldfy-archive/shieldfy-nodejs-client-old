var Hook = require('require-in-the-middle');
var shimmer = require('shimmer');
var path = require('path');
var Request = require('./request');
var async_hooks = require('./instrumentation/async_hooks')
var endOfStream = require('end-of-stream')
var fs = require('fs')
var requestCollector = require('./collectors/requestCollector')


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
            // _currentRequest.$req
            // _currentRequest.$res
            // _currentRequest.$user
            Client._currentRequest = new Request(req);
            Client._currentRequestObj = req;
            //Client._currentRequest.setReq(req);


            new requestCollector(Client._currentRequestObj,function(data){
              console.log(data);
              Client._http._api.trigger('session/step', {
                sessionId: 1,
                host: data.headers.host,
                info: data.getShortInfo(),
                user: {
                  id: data._user.getInfo().id,
                  ip: data._user.getInfo().ip,
                  userAgent: 'userAgent',
                  score: data._user.getInfo().score || 0,
                },  
              });
            })

            endOfStream(res, function (err) {
              //console.log(res);
              console.log('STREAM FINISHED')  
              
            });

            //res.on('end',function(){ console.log('ENDED')});
            res.on('finish',function(){    
              console.log("FINISHED")           
              Client._currentRequest.setRes(res);
            });

            //res.on('close',function(){ console.log('CLOSED')});
            //Client._currentRequest.setReq(req);            
          }

          var returned = original.apply(this, arguments)
          //console.log("Done setting up request -- OH YEAH!");
          return returned;
      };
  });


  /*  IDEA : save the response : write after write 
    Then : when block is there replace the  */
  shimmer.massWrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, ['write'], function (original) {
    return function () {
        if(Client._currentRequest.isDanger()){
          arguments[0] = '';
        }
        var returned = original.apply(this, arguments);
        return returned;
    };
  });

  shimmer.wrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, 'end', function (original) {
    return function () {
      //  console.log(this);
       // console.log('ooooo' , this.output);
       // console.log(arguments);
        //var cb = arguments[0];
        // arguments[0] = 'Alternative Response';
        // arguments[1] = 'utf8';
        // arguments[2] = cb;
      //  console.log(arguments);
        // this.output = [];
        // this.outputSize += 'KEKE'.length;
                console.log('ENDINNNNNNNNNNNNNNNG')
       // return true;
        //process._rawDebug('HTTP ' + (this.statusCode || '').toString()[0] + 'xx');
        Client._currentRequest.end();
        console.log('res',Client._currentRequest.isDanger());
        if(Client._currentRequest.isDanger()){
          arguments[0] = fs.readFileSync(path.join(__dirname, '/Response/Views/block.html'));
        }
        var returned = original.apply(this, arguments);
        //console.log("Done setting up request -- OH YEAH!");
        return returned;
    };
  });


  return exports;
}



module.exports = new Session;