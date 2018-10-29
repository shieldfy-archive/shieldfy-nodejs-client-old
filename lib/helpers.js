var path = require('path')
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

module.exports = {
    'baseDir' : _getBaseDir()
}