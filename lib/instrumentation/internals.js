//var Monitors = require('../monitors/index');

function Internals()
{

}

Internals.prototype.startInstrumentation = function(Client)
{
    var from = Buffer.from;
    Buffer.from = function () {
        console.log('Inturcepting , buffer called with: ',arguments);
        if(arguments[0] == 55){
            //block :(
            Client._needBlock = true;     
            console.log('Should Block Here');
        }
        //Monitors.run('Memory','from','Buffer');
        // var stack = new Error().stack;
        // console.log( stack );
        // do some side-effect of your own
        //return 1;
        return from.apply(this, arguments);
    };
}

module.exports = new Internals;