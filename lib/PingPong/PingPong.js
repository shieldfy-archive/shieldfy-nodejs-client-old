function PingPong(client) {
    this.api = client._api;
    this.rules = client._rules;
}

PingPong.prototype.ping = function(callback)
{
    this.api.trigger('ping', {
        rules: this.rules.get('hashRules'),
    },function(data){
        if (data.update) {
            callback(data);
            return;
        }
    });
}



module.exports = PingPong;