function memoryMonitor()
{

}

memoryMonitor.prototype.run = function(Client)
{
    var from = Buffer.from;
    Buffer.from = function () {
        console.log('buffer called with: ',arguments);
        //var stack = new Error().stack;
        if(arguments[0] == 'abc'){
            Client._currentRequest.setDanger(true);
        }
        //console.log( stack );
        // do some side-effect of your own
        //return 1;
        return from.apply(this, arguments);
    };
    
}

module.exports = new memoryMonitor();