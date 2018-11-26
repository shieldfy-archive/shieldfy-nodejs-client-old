var url = require('url');
var cookie = require('cookie');
var Busboy = require('busboy');

function RequestCollector(req,cb)
{
    var _this=this
    if(req.method === "GET"){
        this.GET_DATA(req, function ()
        {
            cb(_this);
        })
    }
    else
    {
        this.POST_DATA(req, function ()
        {
            cb(_this);
        })
    }
}

RequestCollector.prototype.GET_DATA=function (req,cb)
{
    this.method=req.method;
    this.created=Date();
    this.headers=req.headers;
    this.url=this.getUrl(req)
    this.cookies=cookie.parse(req.headers.cookie || '');
    this.files=[]
    this.body={}

    req.on('end', function ()
        {
            cb()
        });
}

RequestCollector.prototype.POST_DATA=function (req,cb)
{
    var _this = this;

    this.method=req.method;
    this.created=Date();
    this.headers=req.headers;
    this.url=this.getUrl(req)
    this.cookies=cookie.parse(req.headers.cookie || '');
    this.files=[]
    this.body={}

    //extract files and body of data from the request
    //check if content-type is multipart/form-data or post data
    if(req.headers["content-type"].indexOf("multipart/form-data")!==-1)
    {
        this.prepareFormData(req,function(formData)
        {
            _this.files=formData.files;
            _this.body=formData.fields;
            cb();
        });
    }
    else
    {
        this.preparePostData(req,function(postData)
        {
            _this.body=postData
            cb();
        });
    }
}

RequestCollector.prototype.prepareFormData = function(req,cb)
{
    formData={
        files:[],
        fields:{}
    }

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
            formData.files.push(extractedFile);
        });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated)
    {
        formData.fields[fieldname]=val
    });

    busboy.on('finish', function()
    {
        cb(formData);
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
        cb(postData);
    });
}


RequestCollector.prototype.getUrl=function (req)
{
    return {
        protocol:req.protocol,
        hostname:req.hostname,
        path:req.path,
        baseUrl:req.baseUrl,
        orignalUrl:req.originalUrl,
        query:url.parse(req.url, true).query
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
        case "body":
            info.body=this.body;
            break;

        case "files":
            info.files=this.files;
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
            info.body=this.body;
            info.files=this.files;
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
