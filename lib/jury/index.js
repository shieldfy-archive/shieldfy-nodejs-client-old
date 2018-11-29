var RulesBag = require('./Rules');
var Investigation = require('./Investigation');

function Jury(Rules)
{
    this._investigation = new Investigation();
    this._rules = new RulesBag(Rules).build();

    this.req = {
        'headers': {
            'host': 'kom.com',
            'origin': 'kom.com'
        },
        'query': {
            'username': 'karim mohamed',
            'password': 654321,
            'preg-test': 'Hello world'
        }
    }
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

Jury.prototype.target = function(target)
{
    this._target = target;
    return this;
}

Jury.prototype.judge = function()
{
    for (rule in this._use) {
        var res = this._use[rule].run(this._source, this._target)
        return res;
    }
}

module.exports = Jury;