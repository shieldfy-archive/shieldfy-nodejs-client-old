var shimmer = require('shimmer');
var requestCollector = require('../collectors/requestCollector')

function uploadMonitor()
{
    this._client = null;
}

uploadMonitor.prototype.run = function(Client, Instrumentation)
{
    Instrumentation.register('fs',this.handleFile);   
}


uploadMonitor.prototype.handleFile = function(Client,exports, name, version)
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
            // console.log(arguments);
            // console.log(this);
            
            var returned = original.apply(this, arguments);
            return returned;
        };
    });

    shimmer.wrap( exports , 'createReadStream', function (original) {
        return function (path) { 
            console.log('====================================');
            console.log("sucess ReadStream");
            console.log('====================================');
            // console.log(original());
            original(path).on('data',function (chunk){
                    console.log("new chunk recieved:---------------------------------------------------")
                    console.log(chunk)
                    // var rr = Client._jury.use('files').judge(chunk);
                    // if (rr) {
                    //     var severity = Client._monitorBase.parseScore(rr.score)
                    //     console.log('=======================================> '+severity)
                    //     Client._monitorBase.sendToJail(severity)
                    // }
            })
            
            var returned = original.apply(this, arguments);
            return returned;
        };
    });

    // shimmer.wrap( exports , 'createWriteStream', function (original) {
    //     console.log("sucess WriteStream");
    //     return function (path) { 
    //         // console.log(original);
    //         original(path).write(chunk)
    //         var returned = original.apply(this, arguments);
    //         return returned;
    //     };
    // });

    return exports;
}

module.exports = new uploadMonitor();