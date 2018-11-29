// function Rule(id, rule)
// {
//     this._id = id;
//     this._source = rule.source;
//     this._target = rule.target;
//     this._type = rule.type; // Equal | Contain | Preg | RPreg
//     this._rule = rule.rule;
//     this._score = rule.score;
// }



// /**
//  * Get rule info.
//  * @return object;
//  */
// Rule.prototype.getInfo = function()
// {
//     return {
//         id: this._id,
//         source: this._source,
//         target: this._target,
//         rule: this._type,
//         rule: this._rule,
//         score: this._score
//     };
// }



// /**
//  * run the rule against value
//  * @param value
//  * @returns boolean
//  */
// Rule.prototype.run = function(value, source , target)
// {
   
// }


function Rule(id, rule, req = false)
{
    this._id = id;
    this._target = rule.target;
    // this._targetSplit = this.parseTarget(rule.target);
    this._type = rule.type; // Equal | Contain | Preg | RPreg
    this._rule = rule.rule;
    this._score = rule.score;
    this.req = req;
}


Rule.prototype.apply = function(value)
{

}


/**
 * run the rule against value
 */
Rule.prototype.run = function(value, target)
{


    if (target !== '*' && target !== this._target) {
        return;
    }

    if (this._type == 'EQUAL') {
        var result = this.runEqual(value);
    }
    if (this._type == 'CONTAIN') {
        var result = this.runContain(value);
    }
    if (this._type == 'PREG') {
        var result = this.runPreg(value);
    }
    if (this._type == 'RPREG') {
        var result = this.runRPreg(value);
    }

    if (result) {
        return this.getInfo();
    }
    return false;

    // if (typeof this[this._type] === "undefined") {
    //     return false;
    // }

    // var result = this[this._type](this._targetSplit, this._rule, this.req);
    // if (result) {
    //     return this.getInfo();
    // }
    
    // return false;
}

/**
 * Target parse
 * @param target
 * @return object
*/
// Rule.prototype.parseTarget = function(target)
// {
//     var target = this._target.split('.');
//     return {
//         start: target[0],
//         go: target[1],
//         listen: target[2],
//     }
// }

/**
 * is value equal
 * @param this target, this rule, this req
 * @return boolean result
 */
Rule.prototype.runEqual = function(value)
{
    if (this._rule.indexOf('|') !== -1) {
        var splitRule = this._rule.split('|');
        for (r in splitRule) {
            if (value.trim() === splitRule[r]) {
                return true;
            }
        }
    }

    if (value.trim() === this._rule) {
        return true;
    }

    return false;
}

/**
 * is value contain
 * @param this target, this rule, this req
 * @return boolean result
 */
Rule.prototype.runContain = function(value)
{
    if (this._rule.indexOf('|') !== -1) {
        var splitRule = this._rule.split('|');
        for (r in splitRule) {
            if (value !== -1) {
                return true;
            }
        }
    }

    if (value !== -1) {
        return true;
    }

    return false;
}

/**
 * PregMatch
 * @param this target, this rule, this req
 * @return boolean result
 */
Rule.prototype.runPreg = function(value)
{
    var patt = new RegExp(this._rule);
    return patt.test(value);
}

/**
 * Reverse PregMatch
 * @param this target, this rule, this req
 * @return boolean result
 */
Rule.prototype.runRPreg = function(value)
{
    var patt = new RegExp(this._rule);
    if (patt.test(value === false)) {
        return true;
    }
    return false;
}


/**
 * Get rule info.
 * @return object;
 */
Rule.prototype.getInfo = function()
{
    return {
        id: this._id,
        // source: this._source,
        target: this._target,
        rule: this._type,
        rule: this._rule,
        score: this._score
    };
}



module.exports = Rule;