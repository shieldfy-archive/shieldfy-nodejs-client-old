//var localStorage = require('continuation-local-storage');

//var namespaces = {};
//var namespaces = new Map();

function Storage () {
    this._data = new Map();
}

Storage.prototype.set = function(key, value)
{
    this._data.set(key, value);
}

Storage.prototype.get = function(key)
{
   return this._data.get(key);
}

module.exports = Storage;


// // var Storage = require('./storage');

// // var storage = new Storage({
// //     option: 'default'
// // });

// // storage.set('name', 'karim');

// // console.log(storage.get('name'));

// const namespaces = {};


// function set(namespace) {
//     function init(asyncId, type, triggerId, resource) {
//         if (namespace.context[triggerId]) {
//             namespace.context[asyncId] = namespace.context[triggerId];
//         }
//     }

//     function destroy(asyncId) {
//         delete namespace.context[asyncId];
//     }

//     const asyncHook = asyncHooks.createHook({ init, destroy });

//     asyncHook.enable();
// }
