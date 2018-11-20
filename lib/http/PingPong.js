var colors = require('colors'),
    ApiClient = require('../http/ApiClient');

function PingPong() {
    console.log(123);
    this.api = new ApiClient('7nh1p9t', 'e1cc34ae072216e829b114ff1a6c88831ca8dd2807b692a29e3fbbd3830b48ab');
}

PingPong.prototype.ping = function()
{
    console.log('Capsule: run...'.green);
    this.api.request('ping', {
        rules: 'http://localhost:3000/',
    },function(data){
        var data = JSON.parse(data);
        console.log('Capsule: runed.'.green);
        if (data.update) {
            console.log(`Capsule: action ${data.action}.`.green);
            console.log(data.data);
            return;
        }
        console.log('Capsule: nothing new.'.cyan);
    });
}

var pp = new PingPong;

setInterval(function(){
    pp.ping();
}, 3000);