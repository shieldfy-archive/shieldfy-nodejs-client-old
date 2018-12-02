var Rule = require('./Rule');


function Rules(jsonRules)
{
    this._rules = {};
    this._jsonRules = JSON.parse(jsonRules);
}

Rules.prototype.build = function()
{

    for (var type in this._jsonRules) {
        var RulesType = new Array;
        for (var RuleId in this._jsonRules[type]) {
            RulesType.push( new Rule(RuleId,this._jsonRules[type][RuleId]) );
        }      
        this._rules[type] = RulesType;
    }

    return this._rules;
    
}

module.exports = Rules;
