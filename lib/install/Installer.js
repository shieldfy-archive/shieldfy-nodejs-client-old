var cache = require('memory-cache');
var ApiClient = require('../http/ApiClient');

function Installer(client) {
    this.api = new ApiClient(client);
}

Installer.prototype.run = function()
{
    console.log('Rules download...');
    this.api.request('install', {
        host: 'http://localhost:3000/',
        https: '1',
        lang: 'nodeJs',
        sdk_version: process.version,
    },function(data){
        var body = JSON.parse(data);
        cache.put('rules', body.data.rules);
        console.log('Rules loaded');
        // console.log('get rules from cache', cache.get('rules'));
    });
}

module.exports = Installer;