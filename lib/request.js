var uuid = require('uuid')
function Request()
{
    this._id = uuid.v4();
    //console.log('---> starting request #'+this._id);
    this._isDanger = false;
    this._url = '';
}

Request.prototype.setReq = function(req)
{
    this._url  = req.method + ' ' + req.url;
}

Request.prototype.getReq = function()
{
    return this._url;
}


Request.prototype.setDanger = function(status)
{
    this._isDanger = status;
}

Request.prototype.isDanger = function()
{
    return this._isDanger;
}

module.exports = Request;