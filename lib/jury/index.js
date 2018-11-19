/**
 * $func.buffer[0] -> indicate argument 1 at func buffer
 * $mod.mysql.connection.query[0] -> indicate module Mysql , Query function. 
 * 
 * $req == http request object
 * $res == http response object
 * # -- shieldfy collector
 * #user == user collector
 * #request == request collector
 */

/**
 * REQUEST
 * Jury = Jury.pick('request')
 * Jury.judge();
 * 
 * MYSQL 
 * Jury = Jury.pick('db');
 * Jury.judge('mysql.connection.query',argument)
 * 
 * BUFFER
 * Jury = Jury.pick('memory');
 * Jury.judge('buffer',argument);
 * 
 * 
 */

function Jury (){
    this._rules = [
        {
            "Target":"$req.headers.origin",
            "Type":"!=",
            "rule":"$req.headers.host"
        }

    ];

}

Jury.prototype.pick = function(Rules){

}

Jury.prototype.judge = function(Mod,values){
    return 'x';
}


var jr = new Jury();
console.log(jr.judge());
return;

var req = {
    'x':'hello',
    'headers':{ 
        host: 'localhost:3001',
        origin: 'localhost:3002',
        'user-agent': 'curl/7.58.0',
        accept: '*/*' 
    }
}


Object.byString = function(o, s) {
   // s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
   // s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

Object.getArg = function(s)
{
    var a = s.match(/\[(\w+)\]/i);
    if(a === null) return;
    return parseInt(a[1]);
}



var Target1 = "$req.headers.host"; // must translated to : req.headers.origin

var value1 = Target1.replace("$req.","");

console.log( Object.byString(req, value1) === 'localhost:3001' );



var Target2 = "$func.buffer[1]"; // must translated to : req.headers.origin
//var arg = Object.getArg(Target2);

console.log(  Object.getArg(Target2) === 1 );



