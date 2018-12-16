var RulesBag = require('./Rules');

function Jury(Rules)
{
    this._rules = new RulesBag(Rules).build();
    console.log(this._rules);
}

Jury.prototype.use = function(use)
{
    this._use = this._rules[use];
    return this;
}

Jury.prototype.source = function(source)
{
    this._source = source;
    return this;
}

Jury.prototype.target = function(target = '')
{
    this._target = target;
    return this;
}

Jury.prototype.judge = function(guide)
{
    var target = this._target || '';
    for (rule in this._use) {
        var _rule = this._use[rule]
        var rr = _rule.run(guide)
        if (_rule._target == target && rr != false) {
            var out = _rule.run(guide)
        }
        if (target == '' && rr != false) {
            var out = _rule.run(guide)
        }
    }
    return out
}

module.exports = Jury;