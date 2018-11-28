var userCollector=require('../../collectors/userCollector.js');


var http = require('http');


jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
 
describe("userCollector",function () {
    var user
    beforeAll(function(done)
    {
        http.createServer(function(req, res)
        {
            user = new userCollector(req);
            done();
            res.end('Done XD')
        }).listen(8000, function() {
        console.log('Listening for requests');
        });
    });

    describe("userCollector",function () {
    it("should be a object",function () {
        expect(typeof(user)).toBe("object")
    });

    it(".ip should be defined",function () {
        expect(user.ip).toBeDefined()
    });

    it(".userAgent should be defined",function () {
        expect(user.userAgent).toBeDefined()
    });

    it(".id should be defined",function () {
        expect(user.id).toBeDefined()
    });
})

    // it(".ip should match regex",function () {
    //     expect(user.ip).toMatch(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)
    // })
    
})

