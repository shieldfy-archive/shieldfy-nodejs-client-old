var PingPong=require('../../PingPong');
var Client=require('../../client.js');
var Storage = require('../../storage');

var client = new Client();
client._rules=new Storage();
var pingPong=new PingPong();

describe("PingPong",function(){
    it("should be called",function(){
        expect(PingPong).toHaveBeenCalled();
    })
})
