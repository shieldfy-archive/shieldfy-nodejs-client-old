function PingPong(client) {
    this.api = client._http._api;
    this.rules = client._rules;
}

PingPong.prototype.ping = function(callback)
{
    this.api.trigger('ping', {
        lang: 'nodejs',
        rules: this.rules.get('hashRules'),
    },function(data){
        if (data.update) {
            callback(data);
            return;
        }
    });
}



module.exports = PingPong;