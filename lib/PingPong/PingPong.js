var ApiClient = require('../http/ApiClient');

function PingPong(client) {
    this.rules = client._rules;
    this.api = new ApiClient(client);
}

PingPong.prototype.ping = function(callback)
{
    this.api.request('ping', {
        rules: this.rules.get('hashRules'),
    },function(data){
        if (data.update) {
            callback(data);
            return;
        }
    });
}



module.exports = PingPong;