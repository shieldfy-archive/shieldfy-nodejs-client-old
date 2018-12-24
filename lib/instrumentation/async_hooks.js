const asyncHooks = require('async_hooks');

//const namespaces = {};

function hook(Client)
{
    const transactions = new Map();

    Object.defineProperty(Client, '_currentRequest', {
        get () {
            // process._rawDebug(transactions)
          const asyncId = asyncHooks.executionAsyncId()
           return transactions.has(asyncId) ? transactions.get(asyncId) : null
        //  return transactions.has(asyncId) ? transactions.get(asyncId) : transactions.values().next().value
        },
        set (request) {
            const asyncId = asyncHooks.executionAsyncId()
            process._rawDebug("REQUEST ID: "+asyncId)
          transactions.set(asyncId, request)
        }
    });

    const asyncHook = asyncHooks.createHook({ init, destroy });

    function init(asyncId, type, triggerId, resource) {
        if (type === 'TIMERWRAP') return
        // if (type !== 'TickObject' && type !== 'Timeout' ) {
        //     process._rawDebug("AsyncID: "+asyncId+" Type: "+ type+" TriggerId: " +triggerId+" Resource: " + resource)
        //     // process._rawDebug(resource)
        // }
        if(Client._currentRequest){
            // process._rawDebug('==============================================')
            // process._rawDebug(transactions)
            // process._rawDebug("AsyncID: "+asyncId+" Type: "+ type+" TriggerId: " +triggerId+" Resource: " + resource)
            // process._rawDebug('==============================================')
            transactions.set(asyncId, Client._currentRequest)
        }
    }

    function destroy(asyncId) {
        if (!transactions.has(asyncId)) return // in case type === TIMERWRAP
        transactions.delete(asyncId)
    }

    asyncHook.enable();

}

module.exports = hook;


// function createHooks(namespace) {
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
