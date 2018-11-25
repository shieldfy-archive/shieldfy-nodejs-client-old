var ApiClient = require('../http/ApiClient');

function PingPong(client) {
    this.rules = client._rules;
    this.api = new ApiClient(client);
}

PingPong.prototype.ping = function(callback)
{
    console.log('Capsule: run...'.green);
    this.api.request('ping', {
        rules: this.rules.get('hashRules'),
    },function(data){
        console.log('Capsule: runed.');
        if (data.update) {
            console.log(`Capsule: action ${data.action}.`);
            callback(data);
            return;
        }
        console.log('Capsule: nothing new.');
    });
}



module.exports = PingPong;