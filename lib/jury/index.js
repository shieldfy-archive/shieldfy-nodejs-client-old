var RulesBag = require('./Rules');

function Jury(Rules)
{
    this._rules = new RulesBag(Rules).build();
    // this.req = {
    //     'headers': {
    //         'host': 'kom.com'
    //     },
    //     'query': {
    //         'username': 'karim mohamed',
    //         'password': 654321,
    //         'preg-test': 'Hello world'
    //     }
    // }
}

Jury.prototype.use = function(use)
{
    this._use = this._rules[use];
    return this;
}

Jury.prototype.source = function(source)
{
    this._source = source;
    this._sources = [];
    for (i in this._use) {
        this._sources.push(this._use[i]._source);
    }
    console.log(this._sources);
    return this;
}

Jury.prototype.target = function(target)
{
    this._target = target;
    return this;
}

Jury.prototype.judge = function()
{
    if (this._use == 'undefined') {
        return false;
    }
    console.log(this._use);
    return;
    if (this._target == this._source) {
        console.log('done');
        return 0;
    }
    console.log('error')
}

module.exports = Jury;