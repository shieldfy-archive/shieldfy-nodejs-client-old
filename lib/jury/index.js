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
    this._source = this._investigation.request(this.req)[source];
    return this;
}

Jury.prototype.target = function(target)
{
    this._target = this._investigation.request(this.req)[target];
    return this;
}

Jury.prototype.judge = function()
{
    if (this._use == 'undefined') {
        return false;
    }
    if (this._target == this._source) {
        console.log('done');
        return 0;
    }
    console.log('error')
}

module.exports = Jury;