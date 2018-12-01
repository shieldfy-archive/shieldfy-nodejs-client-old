Object.byString = function(o, s) {
   // s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
   // s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function Rule(id, rule)
{
    this._id = id;
    this._source = rule.source;
    this._target = rule.target;
    this._type = rule.type; // Equal | Contain | Preg | RPreg
    this._rule = rule.rule;
    this._score = rule.score;
}



/**
 * Get rule info.
 * @return object;
 */
Rule.prototype.getInfo = function()
{
    return {
        id: this._id,
        source: this._source,
        target: this._target,
        rule: this._type,
        rule: this._rule,
        score: this._score
    };
}



/**
 * run the rule against value
 * @param value
 * @param CurrentRequest Object
 * @returns boolean
 */
Rule.prototype.run = function(value,CurrentRequest)
{
    var req = CurrentRequest._$req;
    //console.log(req);
    var res = CurrentRequest.getRes();
    //get the source
    this._prepareSource(req,res);
    console.log(this._source);
    this._prepareTarget(req,res);
    console.log(this._target);
}


Rule.prototype._prepareSource = function(req,res){
    //'$req.headers.origin'
    if(this._source == '') return;
    var source = this._source.split('.');
    //console.log(source);

    if(source[0] == '$req'){
        source.shift();
        //console.log(source.join('.'));
        this._source =  Object.byString(req,source.join('.'));
    }

    if(source[0] == '$res'){
        source.shift();
        this._source =  Object.byString(res,source.join('.'));
    }

}

Rule.prototype._prepareTarget = function(req,res){
    //'$req.headers.origin'
    if(this._target == '') return;
    var target = this._target.split('.');
    //console.log(target);

    if(target[0] == '$req'){
        target.shift();
        //console.log(target.join('.'));
        this._target =  Object.byString(req,target.join('.'));
    }

    if(target[0] == '$res'){
        target.shift();
        this._target =  Object.byString(res,target.join('.'));
    }
}


// function Rule(id, rule, req = false)
// {
//     this._id = id;
//     this._target = rule.target;
//     this._targetSplit = this.parseTarget(rule.target);
//     this._type = rule.type; // Equal | Contain | Preg | RPreg
//     this._rule = rule.rule;
//     this._score = rule.score;
//     this.req = req;

//     // this._id = 300;
//     // this._target = '$req.query.preg-test';
//     // this._targetSplit = this.parseTarget(this._target);
//     // this._type = 'Preg'; // Equal | Contain | Preg | RPreg
//     // this._rule = /Hello/;
//     // this._score = 30;
//     // this.req = {
//     //     'headers': {
//     //         'host': 'kom.com'
//     //     },
//     //     'query': {
//     //         'username': 'karim mohamed',
//     //         'password': 654321,
//     //         'preg-test': 'Hello world'
//     //     }
//     // }
// }



// /**
//  * Get rule info.
//  * @return object;
//  */
// Rule.prototype.getInfo = function()
// {
//     return {
//         id: this._id,
//         target: this._target,
//         rule: this._type,
//         rule: this._rule,
//         score: this._score
//     };
// }

// Rule.prototype.apply = function(value)
// {

// }


// /**
//  * run the rule against value
//  */
// Rule.prototype.run = function()
// {
//     if (typeof this[this._type] === "undefined") {
//         return false;
//     }

//     var result = this[this._type](this._targetSplit, this._rule, this.req);
//     if (result) {
//         return this.getInfo();
//     }
    
//     return false;
// }

// /**
//  * Target parse
//  * @param target
//  * @return object
// */
// Rule.prototype.parseTarget = function(target)
// {
//     var target = this._target.split('.');
//     return {
//         start: target[0],
//         go: target[1],
//         listen: target[2],
//     }
// }

// /**
//  * is value equal
//  * @param this target, this rule, this req
//  * @return boolean result
//  */
// Rule.prototype.Equal = function(target, rule, req)
// {
//     if (target.start == '$req') {
//         if (rule.indexOf('|') !== -1) {
//             var splitRule = rule.split('|');
//             for (r in splitRule) {
//                 if (req[target.go][target.listen] == splitRule[r]) {
//                     return true;
//                 }
//             }
//         }

//         if (req[target.go][target.listen] == rule) {
//             return true;
//         }

//     }
//     return false;
// }

// /**
//  * is value contain
//  * @param this target, this rule, this req
//  * @return boolean result
//  */
// Rule.prototype.Contain = function(target, rule, req)
// {
//     if (target.start == '$req') {
        
//         if (rule.indexOf('|') !== -1) {
//             var splitRule = rule.split('|');
//             for (r in splitRule) {
//                 if (req[target.go][target.listen].indexOf(splitRule[r]) !== -1) {
//                     return true;
//                 }
//             }
//         }

//         if (req[target.go][target.listen].indexOf(rule) !== -1) {
//             return true;
//         }

//     }
//     return false;
// }

// /**
//  * PregMatch
//  * @param this target, this rule, this req
//  * @return boolean result
//  */
// Rule.prototype.Preg = function(target, rule, req)
// {
//     var patt = new RegExp(rule);
//     return patt.test(req[target.go][target.listen]);
// }

// /**
//  * Reverse PregMatch
//  * @param this target, this rule, this req
//  * @return boolean result
//  */
// Rule.prototype.RPreg = function(target, rule, req)
// {
//     var patt = new RegExp(rule);
//     if (patt.test(req[target.go][target.listen]) === false) {
//         return true;
//     }
//     return false;
// }



module.exports = Rule;