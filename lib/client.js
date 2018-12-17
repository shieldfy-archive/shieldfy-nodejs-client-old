'use strict'

var path = require('path')
var Helpers = require('./helpers');
var Config = require('./config');

var Jury = require('./jury')
var Session = require('./session');
var Monitors = require('./monitors');

var Storage = require('./storage');

var install = require('./install');

var PingPong = require('./PingPong');


var Debug = require('./debug');


var Rules = require('./jury/Rules');
var dependents = require('./dependents');
// var dispatcher = require('./http/Dispatcher');
var http = require('./http');
// var Rules = require('./jury/Rules');
// var dependents = require('./dependents');

//var basedir = __dirname + '/../../';

var Response = require('./Response');
var sessionId = require('./modules/sessionId');

//Initialize Client
function Client ()
{
    this._currentRequest = null;
    this._rules = null;
    this._sessionId = null;
}

Client.prototype.getCurrentRequest = function()
{
    return this._currentRequest ? this._currentRequest.getReq() : 'NONE';
}

Client.prototype.start = function(opts)
{
    this._response = new Response();
    this._sessionId = sessionId();
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

    // this._jury = new Jury(Rules); // _jury.use('db').judge('mysql.connection.query',argument)

    this._rules = new Storage();

    this._debug = new Debug(this._config);
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
        self._jury = new Jury(getRules());
    });
    


   //new dependents(this).run(this._info.dependencies);
   
   new PingPong(this);
}

Client.prototype.logger = function(msg)
{
    process._rawDebug(msg);
}


function getRules(){
    return JSON.parse('{ "request":{"102":{"source":"$req.headers.origin","target":"$req.headers.host","type":"EQUAL","rule":"admin|root","description":"CSRF attack","tag":"csrf","score":"3000"}, "103":{"source":"$req.headers.origin","target":"$req.headers.host","type":"EQUAL","rule":"block","description":"CSRF attack","tag":"csrf","score":"3000"}},"view":{"105":{"source":"$req.headers.origin","target":"$req.headers.host","type":"CONTAIN","rule":"<script>|</script>","description":"CSRF attack","tag":"csrf","score":"3000"}}}');  
}


module.exports = Client;
