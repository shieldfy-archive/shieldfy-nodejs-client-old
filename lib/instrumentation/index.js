'use strict'
var Hook = require('require-in-the-middle');
// var shimmer = require('shimmer');
// var Internals = require('./internals');
var path = require('path');
// var Request = require('../request');
//var async_hooks = require('./async_hooks')
// var monitors = require('../monitors');
var Packages = [
    //'bluebird',
    //'cassandra-driver',
    //'elasticsearch',
    'express',
    //'express-graphql',
    //'express-queue',
    //'generic-pool',
    //'graphql',
    //'handlebars',
    //'hapi',
    'http',
    //'https',
    //'http2',
    //'ioredis',
    //'knex',
    //'koa-router',
    //'mimic-response',
    'mongodb-core',
    'mysql',
    'mysql2',
    //'pg',
    //'redis',
    //'restify',
    //'tedious',
    //'ws',
    'fs'
];

var Modules = new Map();


function Instrumentation ()
{
    console.log('Instrumentation: Starting');
    this._hook = null;
}




Instrumentation.prototype.register = function(Module,Callback)
{
  console.log('Instrumentation: Register Module'+Module);
  Modules.set(Module,Callback);
}

Instrumentation.prototype.registerFunction = function(Func, Callback)
{
  
}

Instrumentation.prototype._proxy = function (Client,exports, name, version) {
  console.log('Patching Module ' + name + '@' + version);
  if(Modules.has(name)){
    //load the required monitor
    var CB = Modules.get(name);
    console.log('Instrumentation: Running Callback for module '+name);
    return CB(Client,exports, name, version);
  }
  return exports;
}


Instrumentation.prototype.start = function(Client)
{
    var self = this;

    this._hook = Hook(Packages, function (exports, name, basedir) {     
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



module.exports = new Instrumentation;

/*

Instrumentation.prototype.start = function(Client)
{
    //Client.logger('starting instrumentation',dependencies);

    //session.start == patch http, express , restify ... etc (request , response) 
    //monitors.start == patch every needed module 
    // all must share the same Client

   // return;
    var self = this;

    async_hooks(Client);



    var x = function() { console.log('called x'); }
    this._hook = Hook(Packages, function (exports, name, basedir) {
      x();
      return exports;
    });
    this._hook = Hook(Packages, function (exports, name, basedir) {
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

        //var version = require(path.join(basedir, 'package.json')).version
        //Client.logger('loading '+ name +'@'+version);
        // var enabled = !disabled.has(name)
        // var pkg, version
    
        // if (basedir) {
        //   pkg = path.join(basedir, 'package.json')
        //   try {
        //     version = JSON.parse(fs.readFileSync(pkg)).version
        //   } catch (e) {
        //     self._agent.logger.debug('could not shim %s module: %s', name, e.message)
        //     return exports
        //   }
        // } else {
        //   version = process.versions.node
        // }

       // return exports;
        return self._proxy(Client,exports, name, version);
        // return self._patchModule(exports, name, version, enabled)
    });
    monitors.start();
    //Internals.startInstrumentation(Client);
}

Instrumentation.prototype._proxy = function(Client,exports,module, version){
 
  Client.logger('Patching Module ' + module + '@' + version);
  shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
      return function (event, req, res) {
         //console.log(event);
        //  console.log("Starting request!");
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

  //var expressRouter = exports.Router;
  // shimmer.wrap(exports, 'createServer', function (original) {
  //   return function () {
  //     console.log("Starting request!");
  //     var returned = original.apply(this, arguments)
  //     console.log("Done setting up request -- OH YEAH!");
  //     return returned;
  //   };
  // });
  // shimmer.wrap(expressRouter, 'process_params', function (original) {
  //   return function (layer, called, req, res, done) {
  //     //console.log(layer);
  //     //console.log(req.url);
  //     //res.req_id = Math.random();
  //     // console.log(res);
  //     //res.end('coca kola');
  //     Client.currentRequest = new Request();
  //     Client.currentRequest.setReq(req);
  //     //console.log('ddd',Client.currentRequest.getReq());
  //    // console.log("Starting process params!");

  //     shimmer.wrap(res, 'end', function (original) {
  //       return function () {
  //         //console.log("Flushing Request",arguments);
  //         if(Client.currentRequest && Client.currentRequest.isDanger())
  //         {
  //           console.log('----- DANGER : ' + Client.currentRequest.getReq())
  //         }else{
  //           console.log('----- CLEAN  : ' + Client.currentRequest.getReq())
  //         }
  //         // if(Client._needBlock){
  //         //   console.log('need block');
  //         //   arguments[0] = 'Shieldfy Block';
  //         //   Client._needBlock = false;
  //         // }
  //         var returned = original.apply(this, arguments)
  //         //console.log("Done Flushing Request -- OH YEAH!");
  //         return returned;
  //       };
  //     });

      
  //     return original.apply(this, arguments)
  //   }
  // });


  return exports;
}

*/

