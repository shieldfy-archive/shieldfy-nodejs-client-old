'use strict'

var path = require('path')
var Helpers = require('./helpers');

var Session = require('./session')
var Monitors = require('./monitors')

//Initialize Client
function Client ()
{
    this._config = {
        appKey : '1',
        appSecret : '2'
    };
    this._currentRequest = null;
}

Client.prototype.getCurrentRequest = function()
{
    return this._currentRequest ? this._currentRequest.getReq() : 'NONE';
}
Client.prototype.start = function(opts)
{
    this._config = Object.assign(this._config,opts);

    var stackObj = {}
    Error.captureStackTrace(stackObj)

    try {
        var pkg = require(path.join(Helpers.baseDir, 'package.json'));
        var pkgLock = require(path.join(Helpers.baseDir, 'package-lock.json'));
    } catch (e) {}

    this._info = {
        pid: process.pid,
        ppid: process.ppid,
        arch: process.arch,
        platform: process.platform,
        node: process.version,      
        startTrace: stackObj.stack.split(/\n */).slice(1),
        main: pkg && pkg.main,
        dependencies: pkgLock ? pkgLock.dependencies : pkg && pkg.dependencies,
        conf: this._config
    };

    this.logger('Shieldfy Agent Started ');
    
    console.log('Client: starting monitors');
    Monitors.start(this);

    console.log('Client: starting session');
    Session.start(this);
    
}

Client.prototype.logger = function(msg)
{
    process._rawDebug(msg);
}

module.exports = Client;