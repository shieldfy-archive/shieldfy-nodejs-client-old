function Rule(Rule)
{
    // this.rules = {
    //     "300":{
    //         "target":"$req.headers.host", //$req , $res
    //         "type":"=",
    //         "rule":"5",
    //         "normalize":false,
    //         "description":"CSRF attack",
    //         "tag":"csrf",
    //         "score":"30"
    //     }    
    // };

    this._id = 300;
    this._target = '5';
    this._type = '=';
    this._rule = '^5$';
    this._score = 30;
    this.req = {
        'headers': {
            'host': 'kom.com'
        }
    }
}

Rule.prototype.parseTarget = function()
{
    // var target = this._target.split('.');
    // if (target[0] == '$req') {
    //     if (target[1] == 'headers') {
    //         return '5';
    //     }
    // }
    reg = new RegExp(this._rule);
    var result = reg.test(this._target);
    return result;
}

Rule.prototype.parseRule = function(value)
{
    return this._rule.test(value);
}

Rule.prototype.run = function()
{
    return this.parseTarget();
}

module.exports = Rule;