'use strict'

var path = require('path')
var Helpers = require('./helpers');
var Config = require('./config');

var Jury = require('./jury')
var Session = require('./session');
var Monitors = require('./monitors');

var Storage = require('./storage');

var install = require('./install');

// var PingPong = require('./PingPong');


var Rules = require('./jury/Rules');
var dependents = require('./dependents');
// var dispatcher = require('./http/Dispatcher');
var http = require('./http');
// var Rules = require('./jury/Rules');
// var dependents = require('./dependents');

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
    
    var baseDir = Helpers.baseDir(new Error());
    try {
        var pkg = require(path.join(baseDir, 'package.json'));
        var pkgLock = require(path.join(baseDir, 'package-lock.json'));
    } catch (e) {}

    this._info = {
        pid: process.pid,
        ppid: process.ppid,
        arch: process.arch,
        platform: process.platform,
        node: process.version,
        startTrace: stackObj.stack.split(/\n */).slice(1),
        main: pkg && pkg.main,
        dependencies: pkgLock ? JSON.stringify(pkgLock.dependencies) : pkg && pkg.dependencies,
        conf: this._config
    };

    this._http = new http(this);

    this.logger('Shieldfy Agent Started');

    // var Data =
    //call rules from API
    // var Rules = new Storage();
    // Rules.set('db',DBRules);
    //pass it to the jury

    //this._jury = new Jury(Rules); // _jury.use('db').judge('mysql.connection.query',argument)

    this._rules = new Storage();
    // //just for test insert in the rules now;

    // this._rules.set('request',getRequestRules());
    //console.log(this._rules.get('request'));


    console.log('Client: starting monitors');
    Monitors.start(this); //can access jury by Client._jury.use().judge();

    console.log('Client: starting session');
    Session.start(this);

    //this._rules.set('db',askljd) = new Storage();

    //new Http(this._config.appKey, this._config.appSecret);

    // new install(this);

    // This test rules
    new install(this, function(self, rules){
        console.log('-------------------------------------- Rules --------------------------------------');
        // console.log(rules.installed);
        // console.log(getRules());
        self._jury = new Jury(rules.installed);
        console.log('-------------------------------------- ./Rules --------------------------------------');
    });

    


   //new dependents(this).run(this._info.dependencies);
    
//    new PingPong(this);
}

Client.prototype.logger = function(msg)
{
    process._rawDebug(msg);
}


function getRules(){
    return JSON.parse('{ "request":{ "101":{"source":"$req.headers.origin","target":"$req.headers.host","type":"CONTAIN","rule":"123|users","description":"CSRF attack","tag":"csrf","score":"30"}, "102":{"source":"$req.headers.origin","target":"$req.headers.hook","type":"EQUAL","rule":"456","description":"CSRF attack","tag":"csrf","score":"50"}, "103":{"source":"$req.headers.origin","target":"$req.query.name","type":"EQUAL","rule":"toot|beeb","description":"CSRF attack","tag":"csrf","score":"70"} } }');  
}


module.exports = Client;
