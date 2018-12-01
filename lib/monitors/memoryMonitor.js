var shimmer = require('shimmer');
var stackCollector = require('../collectors/stackCollector');
function memoryMonitor()
{

}

memoryMonitor.prototype.run = function(Client)
{
    // var from = Buffer.from;
    // Buffer.from = function () {
    //     console.log('buffer called with: ',arguments);
    //     //var stack = new Error().stack;
    //     if(arguments[0] == 'abc'){
    //         //Client._currentRequest.setDanger(true);
    //     }
    //     //console.log( stack );
    //     // do some side-effect of your own
    //     //return 1;
    //     return from.apply(this, arguments);
    // $req.buffer[0]
    // };

    shimmer.wrap(Buffer, 'from', function (original) {
        return function () {
          console.log("Starting buffer.from!");
          //var result = Client._jury.use('memory').target('$req.buffer[0]').judge(arguments[0]);
          
          
          if(arguments[0] == '8'){            
            Client._currentRequest.setDanger(true);
            Client._currentRequest.attachStack(stackCollector());
          }
          var returned = original.apply(this, arguments)
          console.log("Done buffer.from!");
          return returned;
        };
    });
    
}

module.exports = new memoryMonitor();