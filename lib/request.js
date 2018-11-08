var uuid = require('uuid')
function Request(req)
{
    this._id = uuid.v4();
    this._url = '';
    this.setReq(req);    
    process._rawDebug('---> starting request #'+this._id+this.getReq());
    this._isDanger = false;
    
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
    process._rawDebug('---> request #'+this._id+" "+ this.getReq()+' is Danger');
    this._isDanger = status;   
    //console.log( stack );
}

Request.prototype.isDanger = function()
{
    return this._isDanger;
}

Request.prototype.end = function()
{
   process._rawDebug('---> ending request #'+this._id+this.getReq());
   if(this.isDanger()){
    process._rawDebug('++++++++++ Should be blocked ++++++++++++++');
   }

}

module.exports = Request;