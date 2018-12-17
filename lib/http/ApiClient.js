var request = require('request'),
    CryptoJS = require("crypto-js");

/**
 *
 * @param {this} client
 */
function ApiClient(client) {
    this.appKey = client._config.appKey;
    this.appSecret = client._config.appSecret;
    this.baseUrl = client._config.endPoint;
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

    // console.log(JSON.stringify(body))

    function callbackRequest(error, response, body) {

        if (error) {
            console.log(error);
            return false;
        }

        // check the status response of code error
        var statusCodeError = [404, 500];
        if (statusCodeError.includes(response.statusCode)) {
            return false;
        }
        console.log('====================================');
        console.log(body);
        console.log('====================================');

        var body = JSON.parse(body);

        if (body.status == 'error') {
            console.log(body.message);
            return false;
        }

        if (callback) {
            callback(body);
            return false;
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
