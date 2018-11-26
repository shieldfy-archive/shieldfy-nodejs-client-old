var url = require('url');
var cookie = require('cookie');
var Busboy = require('busboy');

function RequestCollector(req,cb)
{
    var _this = this;

    this.method=req.method;
    this.created=Date();
    this.headers=req.headers;
    this.url=this.getUrl(req)
    this.cookies=cookie.parse(req.headers.cookie || '');
    this.data={};
    
    this.getData(req, function (dataObj) {
        _this.data.query=url.parse(req.url, true).query;
        _this.data.body = dataObj.body;
        _this.data.files = dataObj.files;
        cb();
    });
}


RequestCollector.prototype.prepareFormData = function(req,cb)
{
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype)
    {
        var size=0;
        file.on('data', function(data)
        {
            size+=data.length
        });

        file.on('end', function()
        {
            var extractedFile={
            "fieldname":fieldname,
            "originalname":filename,
            "encoding":encoding,
            "mimetype":mimetype,
            "size":size
            }
            dataObj.files.push(extractedFile);
        });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated)
    {
        dataObj.body[fieldname]=val
    });

    busboy.on('finish', function()
    {
        cb();
    });

    req.pipe(busboy);
}

RequestCollector.prototype.preparePostData=function (req,cb)
{
    var postData = []
    req.on('data', function(chunk)
    {
        postData += chunk.toString();
    });
    
    req.on('end', function ()
    {
        dataObj.body=postData
        cb();
    });
}

RequestCollector.prototype.getData=function (req,cb)
{
    dataObj={
        files:[],
        body:{}
    }

    if(req.headers["content-type"].indexOf("multipart/form-data")!==-1)
    {
        this.prepareFormData(req,function()
        {
            cb(dataObj);
        });
    }
    else
    {
        this.preparePostData(req,function()
        {
            cb(dataObj);
        });
    }
}

RequestCollector.prototype.getUrl=function (req)
{
    return {
        protocol:req.protocol,
        hostname:req.hostname,
        path:req.path,
        baseUrl:req.baseUrl,
        orignalUrl:req.originalUrl
        };
}

RequestCollector.prototype.getInfo=function (parameter='')
{

    var info = {
        method : this.method,
        created : this.created,
        score : this.score,
    }

    switch (parameter)
    {
        case "data":
            info.data=this.data;
            break;

        case "headers":
            info.headers=this.headers;
            break;

        case "cookies":
            info.cookies=this.cookies;
            break;

        case "url":
            info.url=this.url;
            break;


        default:
            info.data=this.data;
            info.headers=this.headers;
            info.cookies=this.cookies;
            info.url=this.url;
    }

    return info;

}


RequestCollector.prototype.getProtectedinfo=function ()
{
    var info=this.getInfo();

    delete info.headers;
    delete info.cookies;

    return info;
}

RequestCollector.prototype.getShortInfo=function ()
{
    var info={
        method:this.method,
        url:this.url
    }
    return info;
}

RequestCollector.prototype.setScore=function (score)
{
    this.score=score;
}

RequestCollector.prototype.getScore=function ()
{
    return this.score;
}

RequestCollector.prototype.isSecure=function ()
{
    return (this.url.protocol==="https");
}

module.exports = RequestCollector;
