var Rule = require('./Rule');


function Rules(jsonRules)
{
    this._jsonRules = JSON.parse(jsonRules);
}

Rules.prototype.build = function()
{
    var rulesBag = {};
    for (var type in this._jsonRules) {
        var RulesType = new Array;
        for (var RuleId in this._jsonRules[type]) {
            RulesType.push( new Rule(RuleId,this._jsonRules[type][RuleId]) );
        }      
        rulesBag[type] = RulesType;
    }
    return rulesBag;
   // console.log(rulesBag);

}


/*
function Rules(rules)
{
    var allRules = rules.get('hashRules');
    this._rules = []
    for (key in allRules) {
        var getRules = JSON.parse(rules.get(key));
        for (idRule in getRules) {
            this._rules.push({
                id: idRule,
                rule: getRules[idRule]
            }); 
        }  
    }
}


Rules.prototype.build = function()
{
    for (rule in this._rules) {
        new Rule(this._rules[rule].id, this._rules[rule].rule);
    }
}

*/

module.exports = Rules;
