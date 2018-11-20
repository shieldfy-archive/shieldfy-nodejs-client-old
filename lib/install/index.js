var ApiClient = require('../http/ApiClient');

function Install(client)
{
    var rules = client._rules;
    this.api = new ApiClient(client);
    this.run(rules);
    console.log('Install');
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
        for(key in allRules){
            rules.set(key, allRules[key]);
        }
        console.log('Rules loaded');
        // console.log('get rules from cache', rules.get('db'));
    });
}

module.exports = Install;