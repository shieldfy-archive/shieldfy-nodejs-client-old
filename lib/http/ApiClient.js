var request = require('request'),
    CryptoJS = require("crypto-js");

function ApiClient(appKey, appSecret) {
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.baseUrl = 'http://localhost:5000/v1/';
}

ApiClient.prototype.setupHeader = function(length, hash)
{
    return {
        'Authentication': this.appKey,
        'Authorization':'Bearer ' + hash,
        'Content-Type': 'application/json',
        'Content-Length': length
    };
}

ApiClient.prototype.calculateBodyHash = function(body)
{
    return CryptoJS.HmacSHA256(body, this.appSecret);
}

ApiClient.prototype.request = function(url, body, callback = false)
{
    var hash = this.calculateBodyHash(JSON.stringify(body));
    var options = {
        method: 'POST',
        url: this.baseUrl + url,
        headers: this.setupHeader(body.length, hash),
        form: JSON.stringify(body)
    };
    
    function callbackRequest(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (callback) {
                callback(body);
                return false;
            }
            var body = JSON.parse(body);
            console.log(body);
        } else {
            console.log(response.statusCode);
        }
    }
    
    request(options, callbackRequest);
}


// ApiClient.prototype.buildQuery = function (obj, num_prefix, temp_key)
// {
//     var output_string = [];
//     Object.keys(obj).forEach(function (val) {
//         var key = val;
//         num_prefix && !isNaN(key) ? key = num_prefix + key : '';
//         var key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
//         temp_key ? key = temp_key + '[' + key + ']' : ''
//         if (typeof obj[val] === 'object') {
//             var query = build_query(obj[val], null, key);
//             output_string.push(query);
//         } else {
//             var value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
//             output_string.push(key + '=' + value);
//         }
//     })
//     return output_string.join('&');
// }

module.exports = ApiClient;