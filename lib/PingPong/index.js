var PingPong = require('./PingPong'),
    PingPongAction = require('./PingPongAction');

function _PingPong(client) {

    var __PingPong = new PingPong(client)
    var __PingPongAction = new PingPongAction(client)

    

    setInterval(function(){
        __PingPong.ping(function(data){
            __PingPongAction.runAction(data);
        });
    }, client._config.PingPongTime*1000);
}


module.exports = _PingPong;