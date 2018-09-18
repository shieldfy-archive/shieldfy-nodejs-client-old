'use strict'

require('./internals');

function Instrumentation ()
{
    
}

Instrumentation.prototype.start = function()
{
    console.log('starting instrumentation')
}

module.exports = new Instrumentation;