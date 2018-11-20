var ApiClient = require('../http/ApiClient'),
    crypto = require("crypto");

function Install(client)
{
    var rules = client._rules;
    this.api = new ApiClient(client);
    this.run(rules);
    this._callback = null;
    console.log('Install');
}

Install.prototype.then = function(callback){
    this._callback = callback();
}

Install.prototype.run = function(rules)
{
    console.log('Rules download...');
    this.api.request('install', {
        host: 'http://localhost:3000/',
        https: '1',
        lang: 'nodeJs',
        sdk_version: process.version,
    },function(data){
        var body = JSON.parse(data);
        var allRules = body.data.rules;

        var hashRules = {};
        for(key in allRules){
            rules.set(key, allRules[key]);
            hashRules[key] = crypto.createHash("sha1").update(allRules[key], "binary").digest("hex");
        }

        console.log('Save hashRules', hashRules);
        rules.set('hashRules', hashRules);
        
        console.log('Rules loaded');
        if (this._callback != null) {
            this._callback;
        }
        // console.log('get rules from cache', rules.get('db'));
    });
}


module.exports = Install;