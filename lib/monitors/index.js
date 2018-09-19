function Monitors()
{

}

Monitors.prototype.run = function(MonitorName , Func , Lib)
{
    console.log('Running Monitor',MonitorName,Func,Lib)
}

module.exports = new Monitors();