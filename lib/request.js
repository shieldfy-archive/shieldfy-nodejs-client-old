var uuid = require('uuid')
function Request(req)
{
    this._id = uuid.v4();
    this._url = '';
    this._$req = null;
    this._$res = null;
    this._isDanger = false;

    this.setReq(req);    
    process._rawDebug('---> starting request #'+this._id+this.getReq());
}

Request.prototype.setReq = function(req)
{
    this._$req = req;
    this._url  = req.method + ' ' + req.url;
}

Request.prototype.setRes = function(res)
{
    this._$res = res;
}

Request.prototype.getRes = function()
{
    return this._$res;
}


Request.prototype.getReq = function()
{
    return this._url;
}

Request.prototype.attachStack = function(stack)
{
    this._stack = stack;
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
    //process._rawDebug('++++++++++ Should be blocked ++++++++++++++');
    //process._rawDebug(this._stack);
   }

}

module.exports = Request;