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


var rule = require('./Rule.js');

var rules = {
    "200":{
        "target":"",
        "type":"PREG",
        "rule":"(?:\"[^\"]*[^-]?>)|(?:[^\\w\\s]\\s*\\\/>)|(?:>\")",
        "normalize":true,
        "description":"Finds html breaking injections including whitespace attacks",
        "score":"40",
        "tag":"xss"
    }
};

for (let RuleID in rules) {
    if (rules.hasOwnProperty(RuleID)) {
        var RuleData = element = rules[RuleID];
        var RuleObj = new rule(RuleObj);
    }
}

console.log(RuleObj.getInfo());


return;




function Case()
{
    
}

Case.prototype.rules = function(){

}

Case.prototype.resolve = function(){
    
}

function Jury (){
    this._rules = Rules;
    this._activeRules = {};
}

/**
 * Its a new case
 */
Jury.prototype.createCase = function()
{
    return new Case();
}

Jury.prototype.use = function(RulesName){
    this._activeRules = this._rules[RulesName];
}

Jury.prototype.judge = function(Mod,values){
    return 'x';
}


// var jr = new Jury();
//console.log(jr.judge());


module.exports = Jury;


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



var Storage = require('../storage');

var test = new Storage('test');

test.set('koko','wawa');
console.log(test.get('koko'));

test.set('koko2','wawaXX');
console.log(test.get('koko2'));


for (let index = 0; index < 10000; index++) {
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
    test.set('Hello World Fix '+ index, index + ' KOKO wawa 7777 For ITs Data For HEllo WOrld If that Helps ' + index );
}

