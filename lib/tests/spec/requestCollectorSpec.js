var requestCollector = require('../../collectors/requestCollector');
var Request = require("request");

describe("request collector", () => {
    data={json: true, body: {"name":"amr"}}
    beforeAll((done) => {
        
        req=Request.post({url:'http://localhost:8000/', formData: data}, function optionalCallback(err, httpResponse, body) {

         });
         
        requestInfo=new requestCollector(req,function(){
            done();
        });
    });
    it("get Info should return obj", () => {
        expect(requestInfo.getInfo()).toBe("object");
    });

});
