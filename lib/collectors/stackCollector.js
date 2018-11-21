/**
 * Example Input
 * 
 * Error
 *  at module.exports (/home/eslam/Code/nodejs/shieldfy/lib/collectors/stackCollector.js:27:25)
    at Function.from (/home/eslam/Code/nodejs/shieldfy/lib/monitors/memoryMonitor.js:27:25)
    at Server.requestHandler (/home/eslam/Code/nodejs/simple.js:29:20)
    at emitTwo (events.js:126:13)
    at Server.emit (events.js:214:7)
    at Server.<anonymous> (/home/eslam/Code/nodejs/shieldfy/lib/session.js:61:35)
    at parserOnIncoming (_http_server.js:619:12)
    at HTTPParser.parserOnHeadersComplete (_http_common.js:112:17)
 * 
 *
 * Example Output
 *
 * {
    ['Function.from','/home/eslam/Code/nodejs/shieldfy/lib/monitors/memoryMonitor.js','27'],
    ['Server.requestHandler','/home/eslam/Code/nodejs/simple.js','29'],
    ....
 * }
 * 
 */

module.exports = function()
{
    var stack = new Error().stack;
    return stack;
}