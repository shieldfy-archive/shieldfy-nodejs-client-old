var stackCollector=require('../../collectors/stackCollector.js');

describe("stackCollector",function () {
  it("should be a function",function () {
    expect(typeof(stackCollector)).toBe("function")
  })

  it("should return array not empty",function () {
    var stack = new Error()
    stack=stackCollector(stack)
    expect(typeof(stack)).toBe("object")
    expect(stack.length).not.toBe(0)
  })
})


// var st=" Error\n    at module.exports (/home/eslam/Code/nodejs/shieldfy/lib/collectors/stackCollector.js:27:25)\n    at Function.from (/home/eslam/Code/nodejs/shieldfy/lib/monitors/memoryMonitor.js:27:25)\n    at Server.requestHandler (/home/eslam/Code/nodejs/simple.js:29:20)\n    at emitTwo (events.js:126:13)\n    at Server.emit (events.js:214:7)\n    at Server.<anonymous> (/home/eslam/Code/nodejs/shieldfy/lib/session.js:61:35)\n    at parserOnIncoming (_http_server.js:619:12)\n    at HTTPParser.parserOnHeadersComplete (_http_common.js:112:17)"

describe("stackCollector array",function () {

  it("should contain 3 elements",function () {
    var stack = new Error()
    stack=stackCollector(stack)
    stack.forEach(function (element) {
      expect(element.length).toBe(3)
    })
  })

  it("element of array not be empty",function () {
    var stack = new Error()
    stack=stackCollector(stack)
    stack.forEach(function (element) {
      expect(element[0]).not.toBe(null)
      expect(element[1]).not.toBe(null)
      expect(element[2]).toMatch(/[0-9]*/)
    })
  })
})
