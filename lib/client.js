'use strict'


var path = require('path')
var Instrumentation = require('./instrumentation')
//var basedir = __dirname + '/../../';
//Initialize Client
function Client ()
{
    this._config = {
        appKey : '1',
        appSecret : '2'
    };
    this._needBlock = false;
}

function _getCallerFile() {
    var defaultPrepareStackFunc = Error.prepareStackTrace;
    try {
        var err = new Error();
        var callerfile = undefined;
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();            
            if(currentfile !== callerfile) break;
        }
    } catch (err) {}

    Error.prepareStackTrace = defaultPrepareStackFunc;

    return callerfile;
}

function _getBaseDir()
{
    var baseDir = _getCallerFile();
    if(baseDir === undefined) baseDir = __dirname + '/../../';
    return path.dirname(baseDir);
}

Client.prototype.start = function(opts)
{

    var basedir = _getBaseDir();

    this._config = Object.assign(this._config,opts);
    // console.log('hi');
    // console.log(this._config);
    // console.log(basedir);
    var stackObj = {}
    Error.captureStackTrace(stackObj)

    try {
      var pkg = require(path.join(basedir, 'package.json'))
    } catch (e) {}

    this._info = {
        pid: process.pid,
        ppid: process.ppid,
        arch: process.arch,
        platform: process.platform,
        node: process.version,      
        startTrace: stackObj.stack.split(/\n */).slice(1),
        main: pkg && pkg.main,
        dependencies: pkg && pkg.dependencies,
        conf: this._config
    };

   // console.log('agent configured correctly %o', this._info)
    this.logger('Agent Started ');
    //start Monitors

    //start Instrumentation
    Instrumentation.start(this,this._info.dependencies)
}

Client.prototype.logger = function(msg)
{
    process._rawDebug(msg);
}

module.exports = Client;