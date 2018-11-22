function Rule(Rule)
{
    this._id = 300;
    this._target = '$req.query.preg-test';
    this._targetSplit = this.parseTarget(this._target);
    this._type = 'Preg'; // Equal | Contain | Preg
    this._rule = /Hello/;
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

Rule.prototype.run = function()
{
    if (typeof this[this._type] === "undefined") {
        return false;
    }

    var result = this[this._type](this._targetSplit, this._rule);
    if (result) {
        return this.getInfo();
    }
    
    return false;
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

Rule.prototype.Equal = function(target, rule)
{
    if (target.start == '$req') {
        if (rule.indexOf('|') !== -1) {
            var splitRule = rule.split('|');
            for (r in splitRule) {
                if (this.req[target.go][target.listen] == splitRule[r]) {
                    return true;
                }
            }
        }

        if (this.req[target.go][target.listen] == rule) {
            return true;
        }

    }
    return false;
}

Rule.prototype.Contain = function(target, rule)
{
    if (target.start == '$req') {
        
        if (rule.indexOf('|') !== -1) {
            var splitRule = rule.split('|');
            for (r in splitRule) {
                if (this.req[target.go][target.listen].indexOf(splitRule[r]) !== -1) {
                    return true;
                }
            }
        }

        if (this.req[target.go][target.listen].indexOf(rule) !== -1) {
            return true;
        }

    }
    return false;
}

Rule.prototype.Preg = function(target, rule)
{
    var patt = new RegExp(rule);
    return patt.test(this.req[target.go][target.listen]);
}

Rule.prototype.RPreg = function(target, rule)
{
    var patt = new RegExp(rule);
    if (patt.test(this.req[target.go][target.listen]) === false) {
        return true;
    }
    return false;
}

Rule.prototype.getInfo = function()
{
    return {
        id: this._id,
        score: this._score
    };
}

module.exports = Rule;