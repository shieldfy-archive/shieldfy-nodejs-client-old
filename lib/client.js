'use strict'

var path = require('path')
var Helpers = require('./helpers');
var Config = require('./config');

//var Jury = require('./jury')
var Session = require('./session');
var Monitors = require('./monitors');

var Storage = require('./storage');

var install = require('./install');

//var basedir = __dirname + '/../../';

//Initialize Client
function Client ()
{
    this._currentRequest = null;
    this._rules = null;
}

Client.prototype.getCurrentRequest = function()
{
    return this._currentRequest ? this._currentRequest.getReq() : 'NONE';
}

Client.prototype.start = function(opts)
{
    // this._config = Object.assign(this._config,opts);
    this._config = new Config().setConfig(opts);

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

    this.logger('Shieldfy Agent Started');
    
    // var Data = 
    //call rules from API
    // var Rules = new Storage();
    // Rules.set('db',DBRules);
    //pass it to the jury
    
    //this._jury = new Jury(Rules); // _jury.use('db').judge('mysql.connection.query',argument)

    this._rules = new Storage();

    console.log('Client: starting monitors');
    Monitors.start(this); //can access jury by Client._jury.use().judge();

    console.log('Client: starting session');
    Session.start(this);
    
    //this._rules.set('db',askljd) = new Storage();

    //new Http(this._config.appKey, this._config.appSecret);
    new install(this);
}

Client.prototype.logger = function(msg)
{
    process._rawDebug(msg);
}

module.exports = Client;