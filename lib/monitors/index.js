var Instrumentation = require('../instrumentation');
var monitorBase = require('./MonitorBase');

var MonitorsList = [
    'db',
    //'memory',
    'request',
    'view',
    // 'user',
    'upload'
];

function Monitors()
{
    // 
}

Monitors.prototype.start = function(Client)
{
    Client._monitorBase = new monitorBase(Client)
    
    var len = MonitorsList.length;
    for(var i=0; i<len;++i){
        this.run(MonitorsList[i],Client , Instrumentation);
        console.log('Monitors: loading monitor '+MonitorsList[i]);
    }
    Instrumentation.start(Client);
}

Monitors.prototype.run = function (Monitor,Client , Instrumentation) {
    //this._agent.logger.debug('shimming %s@%s module', name, version)
    return require('./' + Monitor + 'Monitor').run(Client,Instrumentation)
}

module.exports = new Monitors;