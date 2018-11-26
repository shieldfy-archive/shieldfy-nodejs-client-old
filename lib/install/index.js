var ApiClient = require('../http/ApiClient'),
    crypto = require("crypto");

function Install(client, callback)
{
    this.client = client;
    this.api = client._http._api;
    var rules = client._rules;
    this.run(rules, callback);
    // this._callback = null;
    console.log('Install');
}

// Install.prototype.then = function(callback){
//     this._callback = callback();
// }

Install.prototype.run = function(rules, callback = false)
{
    console.log('Rules download...');
    this.api.trigger('install', {
        host: this.client._config.endPoint,
        https: '1',
        lang: 'nodeJs',
        sdk_version: process.version,
    },function(body){
        var allRules = body.data.rules;

        var hashRules = {};
        for(key in allRules){
            rules.set(key, allRules[key]);
            hashRules[key] = crypto.createHash("sha1").update(allRules[key], "binary").digest("hex");
        }

        console.log('Save hashRules', hashRules);
        rules.set('hashRules', hashRules);
        
        console.log('Rules loaded');
        if (callback != false) {
            callback(rules);
        }
        // if (this._callback != null) {
        //     this._callback;
        // }
        // console.log('get rules from cache', rules.get('db'));
    });
}


module.exports = Install;