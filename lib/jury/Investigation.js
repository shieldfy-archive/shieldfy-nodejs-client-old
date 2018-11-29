function Investigation(Rules)
{

}

Investigation.prototype.request = function(request)
{
    var __out = {};
    for (req in request) {
        for (_req in request[req]) {
            __out['$req.'+req+'.'+_req] = request[req][_req];
        }
    }
    return __out;
}

module.exports = Investigation;