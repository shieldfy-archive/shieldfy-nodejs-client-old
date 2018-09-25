var ApiClient = require('./ApiClient');

function Http(appKey, appSecret)
{
    var ApiClient_ = new ApiClient(appKey, appSecret);
    ApiClient_.request('install', {
        host: 'http://localhost:3000/'
    });
}

module.exports = Http;