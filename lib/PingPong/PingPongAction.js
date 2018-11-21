var crypto = require("crypto");

function PingPongAction(client) {
    this.rules = client._rules;
}

PingPongAction.prototype.rulesAction = function(allRules)
{
    var hashRules = this.rules.get('hashRules');
    for(key in allRules){
        this.rules.set(key, allRules[key]);
        hashRules[key] = crypto.createHash("sha1").update(allRules[key], "binary").digest("hex");
    }
    this.rules.set('hashRules', hashRules);
}

PingPongAction.prototype.runAction = function(pong)
{
    if (pong.action == 'rules') {
        console.log('------------------------------- Rules updated -------------------------------');
        this.rulesAction(pong.data);
    }
}

module.exports = PingPongAction;