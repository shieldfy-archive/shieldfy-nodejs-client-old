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

 // var stack=" Error\n    at module.exports (/home/eslam/Code/nodejs/shieldfy/lib/collectors/stackCollector.js:27:25)\n    at Function.from (/home/eslam/Code/nodejs/shieldfy/lib/monitors/memoryMonitor.js:27:25)\n    at Server.requestHandler (/home/eslam/Code/nodejs/simple.js:29:20)\n    at emitTwo (events.js:126:13)\n    at Server.emit (events.js:214:7)\n    at Server.<anonymous> (/home/eslam/Code/nodejs/shieldfy/lib/session.js:61:35)\n    at parserOnIncoming (_http_server.js:619:12)\n    at HTTPParser.parserOnHeadersComplete (_http_common.js:112:17)"

module.exports = function(stack)
{
// var t0 = performance.now();

    // var stack = new Error().stack;
     stack = stack.stack;
    // console.log(stack);
    stack=stack.split(" at ");//this is an array
    stack.shift();//remove first line
    stack.shift();//remove second line
    stack.pop();//remove last line

//split the errorLog from the path
stack=stack.map(function (pharse) {
  return pharse.trim().split(" (");
});
// console.log(stack);

for (var i = 0; i < stack.length; i++) {
  var str=stack[i][1];

  stack[i][1]=str.substring(0,str.length-1);//remove parentheses
  // stack[i][1]=str.match(/(.*)\)/)[1]; //remove right parenthes by regex

  stack[i].push(str.match(/:([0-9]*):/)[1]); //get line no.

  // stack[i][1]=str.substring(0,str.indexOf(':')); //remove path
  stack[i][1]=str.match(/(.*\.js)/)[1]; //remove path by regex
}
// console.log(stack);
    return stack;
    // var t1 = performance.now();
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
}
