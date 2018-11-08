var Instrumentation = require('../instrumentation');
    console.log('Instrumentation');
    console.log(Instrumentation);
var MonitorsList = [
    //'memory',
    'view'
];

function Monitors()
{
    //console.log('monitors.start');
}

Monitors.prototype.start = function(Client)
{
    
    var len = MonitorsList.length;
    for(var i=0; i<len;++i){
        this.run(MonitorsList[i],Client , Instrumentation);
        console.log('Monitors: loading monitor '+MonitorsList[i]);
    }
    Instrumentation.start(Client);
}


// Monitors.prototype.run = function(MonitorName , Func , Lib)
// {

//     console.log('Running Monitor',MonitorName,Func,Lib)
// }

Monitors.prototype.run = function (Monitor,Client , Instrumentation) {
    //this._agent.logger.debug('shimming %s@%s module', name, version)
    return require('./' + Monitor + 'Monitor').run(Client,Instrumentation)
}

module.exports = new Monitors;