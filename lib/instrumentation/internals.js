//var Monitors = require('../monitors/index');



function Internals()
{

}

Internals.prototype.startInstrumentation = function(Client)
{

    global.setTimeout = wrapCallbackFirst(Client, global, 'setTimeout')
    global.setInterval = wrapCallbackFirst(Client, global, 'setInterval')
    global.setImmediate = wrapCallbackFirst(Client, global, 'setImmediate')
    process.nextTick = wrapCallbackFirst(Client, process, 'nextTick')

    var from = Buffer.from;
    Buffer.from = function () {
        
        if(arguments[0] == 8){
            //block :(
            //console.log('Inturcepting , buffer called with: ',arguments);
            Client.currentRequest.setDanger(true);
            //Client._needBlock = true;     
            //console.log('Should Block Here');
        }
        //Monitors.run('Memory','from','Buffer');
        // var stack = new Error().stack;
        // console.log( stack );
        // do some side-effect of your own
        //return 1;
        return from.apply(this, arguments);
    };
}

function wrapCallbackFirst (Client, mod, name) {
    var orig = mod[name]
    return function () {
      // store the current request so we can restore it later
      var req = Client.currentRequest
  
      // clone arguments so we can inject our own callback
      var args = []
      for (var n = 0; n < arguments.length; n++) {
        args[n] = arguments[n]
      }
  
      // inject our own callback
      var fn = args[0]
      args[0] = function () {
        // restore the current request from the closure
        Client.currentRequest = req
        // call the original callback
        var res = fn.apply(this, arguments)
        if(Client.currentRequest && Math.random() < 0.25){
            Client.currentRequest.setDanger(true); //just a test
        }
      }
  
      orig.apply(mod, args)
    }
  }

module.exports = new Internals;