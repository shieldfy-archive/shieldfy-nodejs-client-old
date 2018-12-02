var shimmer = require('shimmer');
var url = require('url');
var querystring = require('querystring');

/**
 * CSRF
 * "101":{
 *      "source":"$req.headers.origin"
        "target":"$req.headers.host",
		"type":"compare", //== , != , < , > , <= , >= 
		"rule":"!=",
		"description":"CSRF attack",
		"tag":"csrf",
		"score":"30"
    }
    "103":{
        "source":"$req.*"
        "target":"$res.*",
		"type":"PREG",
		"rule":"(\\%0d.*\\%0a|%E5%98%8A.*%E5%98%8D|\\u560a.*\\u560d)",
		"description":"CRLF Injection attack",
		"tag":"crlf",
		"score":"70"
    }
 * CRLF
 * Backdoors upload
 */
function sendToJail(data)
{
    console.log('sendToJail', data)
}

function requestMonitor()
{
    this._client = null;
}

requestMonitor.prototype.run = function(Client, Instrumentation)
{
    console.log('------------------------------------------------------------------------------------------------------');
    var judge = Client._jury.use('request').judge('123');

    console.log(judge);
    console.log('------------------------------------------------------------------------------------------------------');
    Instrumentation.register('http',this.handleRequest);   
}


requestMonitor.prototype.handleRequest = function(Client,exports, name, version)
{
    process._rawDebug('REQUEST2 ==> '  + 'xx ');
    
    process._rawDebug(exports && exports.Server && exports.Server.prototype);

    shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
        return function (event, req, res) {  
            //jury is already loaded with $req, $res
           // var result = Client._jury.use('request').judge(); // csrf all file uploads
            // if(result){
            //     Cient._currentRequest.sendToJail(result);
            // }
            //Client._jury.use('request').source('$req.*').target('$res.*').judge();
            //Client._jury.use('memory').target('$buffer.from').judge();
            
            //console.log(arguments);                  
            if (event === 'request') {

                var querys = querystring.parse(url.parse(Client._currentRequest.getReq()).query)
                console.log('--------------------------------------------------------------------------------------------')
                for (var query in querys) {
                    console.log(querys[query])
                    var rr = Client._jury.use('request').judge(querys[query]);
                    if (rr) {
                        sendToJail(rr);
                    }
                }
                console.log('--------------------------------------------------------------------------------------------')


                // console.log("REQUEST MONITOR");
                // console.log(Client._currentRequest.getReq());
                //res.on('end',function(){ console.log('ENDED')});
                res.on('finish',function(){    
                  //  console.log(Client._currentRequest.getRes()._header);
                });
            }

            
            var returned = original.apply(this, arguments);
            return returned;
        };
    });

    // shimmer.wrap(exports && exports.ServerResponse && exports.ServerResponse.prototype, 'end', function (original) {
    //     return function () {           
    //         console.log("RESPONSE MONITOR ");
    //         console.log(Client._currentRequest.getRes());
    //         var returned = original.apply(this, arguments);
    //         //console.log("Done setting up request -- OH YEAH!");
    //         return returned;
    //     }
    // });

    return exports;
}

module.exports = new requestMonitor();