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
            // _currentRequest.$req
            // _currentRequest.$res
            // _currentRequest.$user
            Client._currentRequest = new Request(req);
            console.log('# request monitor #')
            Client._currentRequestObj = req;
            //Client._currentRequest.setReq(req);


            

            endOfStream(res, function (err) {
              //console.log(res);
              console.log('STREAM FINISHED')  
              
            });

            //res.on('end',function(){ console.log('ENDED')});
            // res.on('finish',function(){
            //   console.log("FINISHED")
              
            //   new requestCollector(Client._currentRequestObj, res, function(data){
            //     Client._http._api.trigger('session/step', {
            //       sessionId: Client._sessionId,
            //       host: data.headers.host,
            //       info: {
            //         method: data.getShortInfo().method,
            //         uri: data.getShortInfo().url.href,
            //         code: data.statusCode,
            //       },
            //       user: {
            //         id: data._user.getInfo().id,
            //         ip: data._user.getInfo().ip,
            //         userAgent: 'userAgent',
            //         score: data._user.getInfo().score || 0,
            //       },  
            //     });
            //   })   
            //   Client._currentRequest.setRes(res);
            // });

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
      console.log('# write monitor #')
      // console.log('====================================');
      // console.log(typeof(Client._currentRequestObj.isDanger));
      // console.log('====================================');
        if(Client._currentRequest.isDanger()){
          arguments[0] = '';
        }
        var returned = original.apply(this, arguments);
        return returned;
    };
  });

  shimmer.wrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, 'end', function (original) {
    return function () {
      console.log('# end monitor #')
      // console.log('====================================');
      // console.log(Client._currentRequest.isDanger());
      // console.log('====================================');
        Client._currentRequest.end();
        // console.log('res',Client._currentRequest.isDanger());
        if(Client._currentRequest.isDanger()){
          arguments[0] = Client._response.block();
        }
        var returned = original.apply(this, arguments);
        return returned;
    };
  });


  return exports;
}



module.exports = new Session;