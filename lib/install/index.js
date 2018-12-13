var ApiClient = require('../http/ApiClient'),
    crypto = require("crypto");

function Install(client, callback)
{
    this.client = client;
    this.api = client._http._api;
    var rules = client._rules;
    this.run(client, rules, callback);
    // this._callback = null;
    console.log('Install');
}

// Install.prototype.then = function(callback){
//     this._callback = callback();
// }

Install.prototype.run = function(client, rules, callback = false)
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
        var installed = {};
        for(key in allRules){
            rules.set(key, allRules[key]);
            hashRules[key] = crypto.createHash("sha1").update(allRules[key], "binary").digest("hex");
            installed[key] = JSON.parse(allRules[key]);
        }

        client._debug.set('Save hashRules', hashRules);
        rules.set('hashRules', hashRules);
        rules.set('rulesInstalled', installed);

        // rules installed

        rules.installed = installed;
        
        client._debug.set('Rules loaded');
        if (callback != false) {
            callback(client, rules);
        }
        // if (this._callback != null) {
        //     this._callback;
        // }
        // console.log('get rules from cache', rules.get('db'));
    });
}


module.exports = Install;