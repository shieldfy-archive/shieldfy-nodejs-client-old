var shimmer = require('shimmer');
var requestCollector = require('../collectors/requestCollector')

function filesMonitor()
{
    this._client = null;
}

filesMonitor.prototype.run = function(Client, Instrumentation)
{
    Instrumentation.register('fs',this.handleRequest);   
}


filesMonitor.prototype.handleRequest = function(Client,exports, name, version)
{
    shimmer.wrap( exports , 'readFile', function (original) {
        
        return function (path, callback) {
            console.log("sucess readFile");
            original(path,'utf8',function(err,data){
                console.log('====================================');
                console.log(data);
                console.log('====================================');
                // var rr = Client._jury.use('files').judge(data);
                // if (rr) {
                //     var severity = Client._monitorBase.parseScore(rr.score)
                //     console.log('=======================================> '+severity)
                //     Client._monitorBase.sendToJail(severity)
                // }
            })
            console.log(arguments);
            // console.log(this);
            
            var returned = original.apply(this, arguments);
            return returned;
        };
    });

    // shimmer.wrap( exports , 'ReadStream', function (original) {
    //     console.log("sucess ReadStream");
    //     return function (event, req, res) { 
           
    //         var returned = original.apply(this, arguments);
    //         return returned;
    //     };
    // });

    // shimmer.wrap( exports , 'WriteStream', function (original) {
    //     console.log("sucess WriteStream");
    //     return function (event, req, res) { 
           
    //         var returned = original.apply(this, arguments);
    //         return returned;
    //     };
    // });

    return exports;
}

module.exports = new filesMonitor();