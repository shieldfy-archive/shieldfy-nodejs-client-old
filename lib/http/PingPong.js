var colors = require('colors'),
    ApiClient = require('../http/ApiClient');

function PingPong(client) {
    this.rules = client._rules;
    this.api = new ApiClient(client);
}

PingPong.prototype.ping = function()
{
    console.log('Capsule: run...'.green);
    this.api.request('ping', {
        rules: this.rules.get('hashRules'),
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



module.exports = PingPong;