var RulesBag = require('./Rules');
var Investigation = require('./Investigation');

function Jury(Rules)
{
    this._investigation = new Investigation();
    this._rules = new RulesBag(Rules).build();

    this.req = {
        'headers': {
            'host': '123',
            'origin': 'kom.com'
        },
        'query': {
            'username': 'karim mohamed',
            'password': 654321,
            'preg-test': 'Hello world'
        }
    }

    // console.log(this._investigation.request(this.req))
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