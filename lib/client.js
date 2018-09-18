'use strict'

function Client ()
{
    this._config = {
        appKey : '1',
        appSecret : '2'
    };
}

Client.prototype.start = function(opts)
{
    this._config = Object.assign(this._config,opts);
    
    
    console.log('hi');
    console.log(this._config);
}

module.exports = Client;