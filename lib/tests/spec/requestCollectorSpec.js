var requestCollector = require('../../collectors/requestCollector');

var http = require('http');


jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
 
describe("requestCollector",function () {
    var requestInfo
    beforeAll(function(done)
    {
        http.createServer(function(req, res)
        {
            new requestCollector(req,function(data){
                requestInfo = data
                done();
            });
        }).listen(8000, function() {
        console.log('Listening for requests');
        });
    });
    
    it("should return a object",function () {
        expect(typeof(requestInfo)).toBe("object")
    })

    it(".getInfo should return a object",function () {
        expect(typeof(requestInfo.getInfo())).toBe("object")
    })


    it(".isSecure should return a boolean",function () {
        expect(typeof(requestInfo.isSecure())).toBe("boolean")
    })

    it(".method should be defined a boolean and not null",function () {
        expect(requestInfo.method).toBeDefined()
        expect(requestInfo.method).not.toBeNull()
    })

    it(".created should be defined and not null",function () {
        expect(requestInfo.created).toBeDefined()
        expect(requestInfo.created).not.toBeNull()
    })

    it(".headers should be defined and not null",function () {
        expect(requestInfo.headers).toBeDefined()
        expect(requestInfo.headers).not.toBeNull()
    })

    it(".url should be defined and not null",function () {
        expect(requestInfo.url).toBeDefined()
        expect(requestInfo.url).not.toBeNull()
    })

    it(".cookie should be defined",function () {
        expect(requestInfo.cookie).not.toBeDefined()
    })

    it(".query should be defined",function () {
        expect(requestInfo.query).toBeDefined()
    })

    it(".files should be defined",function () {
        expect(requestInfo.files).toBeDefined()
    })

    it(".body should be defined",function () {
        expect(requestInfo.body).toBeDefined()
    })

    it("has no body or file if the request method is GET or HEAD",function () {
        if(requestInfo.method === "GET" || requestInfo.method === "HEAD"){
            expect(requestInfo.body).toEqual({})
            expect(requestInfo.files).toEqual([])
        }

    })
    
})
