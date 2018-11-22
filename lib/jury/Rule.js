function Rule(Rule)
{
    this._id = 300;
    this._target = '$req.query.preg-test';
    this._targetSplit = this.parseTarget(this._target);
    this._type = 'Contain'; // Equal | Contain | Preg
    this._rule = 'Hello';
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

Rule.prototype.parseTarget = function(target)
{
    var target = this._target.split('.');
    return {
        start: target[0],
        go: target[1],
        listen: target[2],
    }
}

Rule.prototype.Equal = function()
{
    if (this._targetSplit.start == '$req') {
        if (this._rule.indexOf('|') !== -1) {
            var splitRule = this._rule.split('|');
            for (r in splitRule) {
                if (this.req[this._targetSplit.go][this._targetSplit.listen] == splitRule[r]) {
                    return true;
                }
            }
        }

        if (this.req[this._targetSplit.go][this._targetSplit.listen] == this._rule) {
            return true;
        }

    }
    return false;
}

Rule.prototype.Contain = function()
{
    if (this._targetSplit.start == '$req') {
        
        if (this._rule.indexOf('|') !== -1) {
            var splitRule = this._rule.split('|');
            for (r in splitRule) {
                if (this.req[this._targetSplit.go][this._targetSplit.listen].indexOf(splitRule[r]) !== -1) {
                    return true;
                }
            }
        }

        if (this.req[this._targetSplit.go][this._targetSplit.listen].indexOf(this._rule) !== -1) {
            return true;
        }

    }
    return false;
}

Rule.prototype.Preg = function()
{
    var patt = new RegExp(this._rule);
    return patt.test(this.req[this._targetSplit.go][this._targetSplit.listen]);
}

Rule.prototype.run = function()
{
    if (typeof this[this._type] === "undefined") {
        return 'Out rule';
    }
    return this[this._type]();
}

module.exports = Rule;