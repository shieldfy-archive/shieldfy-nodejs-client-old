function Rule(Rule)
{
    this._id = 300;
    this._target = '$req.query.preg-test';
    // this._targetSplit = this._target.split('.');
    this._type = 'Preg'; // Equal | Contain | Preg
    this._rule = /Hello/g;
    this._score = 30;
    this.req = {
        'headers': {
            'host': 'kom.com'
        },
        'query': {
            'username': 'karim mohamed',
            'password': 654321,
            'preg-test': 'Hello world'
        }
    }
}

Rule.prototype.Equal = function()
{
    var target = this._target.split('.');

    var start = target[0];
    var go = target[1];
    var listen = target[2];

    if (start == '$req') {
        if (this._rule.indexOf('|') !== -1) {
            var splitRule = this._rule.split('|');
            for (r in splitRule) {
                if (this.req[go][listen] == splitRule[r]) {
                    return true;
                }
            }
        }

        if (this.req[go][listen] == this._rule) {
            return true;
        }

    }
    return false;
}

Rule.prototype.Contain = function()
{
    var target = this._target.split('.');

    var start = target[0];
    var go = target[1];
    var listen = target[2];

    if (start == '$req') {
        
        if (this._rule.indexOf('|') !== -1) {
            var splitRule = this._rule.split('|');
            for (r in splitRule) {
                if (this.req[go][listen].indexOf(splitRule[r]) !== -1) {
                    return true;
                }
            }
        }

        if (this.req[go][listen].indexOf(this._rule) !== -1) {
            return true;
        }

    }
    return false;
}

Rule.prototype.Preg = function()
{
    var target = this._target.split('.');
    var go = target[1];
    var listen = target[2];

    var patt = new RegExp(this._rule);
    return patt.test(this.req[go][listen]);
}

Rule.prototype.run = function()
{
    if (typeof this[this._type] === "undefined") {
        return 'Out rule';
    }
    return this[this._type]();
}

module.exports = Rule;