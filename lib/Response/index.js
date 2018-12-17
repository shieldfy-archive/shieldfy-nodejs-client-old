var path = require('path');
var fs = require('fs');

function Response()
{
    //
}

Response.prototype.block = function(incidentId)
{
    var viewBlock = fs.readFileSync(path.join(__dirname, '/Views/block.html'));
    return viewBlock.toString().replace('{incidentId}', incidentId);
}

module.exports = new Response();