var url = require('url');
var cookie = require('cookie');
var Busboy = require('busboy');
var { parse } = require('querystring');
var userCollector = require('./userCollector');

/**
 * 
 * @constructor
 * @param {object} req 
 * @param {function} cb 
 */
function RequestCollector(req,res,cb)
{
    var _this = this
    this._user = new userCollector(req)

    this.collectData(req,res, function ()
    {
        cb(_this);
    })

}

/**
 * initialize the requestCollector props
 * 
 * @param {object} req 
 * @param {function} cb 
 */
RequestCollector.prototype.collectData = function(req,res,cb)
{
    this.statusCode = res ? res.statusCode : '';
    this.score = '';
    this.method = req ? req.method : '';
    this.created = req ? Date():'';
    this.headers = req ? req.headers : '';
    this.url = req ? this.getUrl(req) : '';
    this.cookies = req ? cookie.parse(req.headers.cookie || '') : '';
    this.query = req ? url.parse(req.url, true).query : '';
    this.files = []
    this.body = {}

    //check if the reuest has a content
    if(req && req.headers["content-type"])
    {
        //extract files and body of data from the request
        this.getPostData(req,function(){
            cb();
        })
    }
    else
    {
        cb();
    }
}

/**
 * extract the data from the request
 * check the data type of the body
 * 
 * @param {object} req 
 * @param {function} cb 
 */
RequestCollector.prototype.getPostData = function(req,cb)
{
    var _this = this
    
    // check if the content type is multipart/form-data
    if(req.headers["content-type"].indexOf("multipart/form-data")!==-1)
    {
        this.prepareFormData(req,function(formData)
        {
            _this.files = formData.files;
            _this.body = formData.fields;
            cb();
        });
    }
    else
    {
        this.preparePostData(req,function(postData)
        {
            _this.body = postData
            cb();
        });
    }
}

/**
 * extract the data from the form-data
 * 
 * @param {object} req 
 * @param {function} cb 
 */
RequestCollector.prototype.prepareFormData = function(req,cb)
{
    formData = {
        files:[],
        fields:{}
    }

    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype)
    {
        var size=0;
        var fileContent = []
        file.on('data', function(data)
        {
            fileContent += data.toString();
            size+=data.length
        });

        file.on('end', function()
        {
            var extractedFile={
            "fieldname":fieldname,
            "originalname":filename,
            "encoding":encoding,
            "mimetype":mimetype,
            "size":size,
            "content":fileContent
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

/**
* extract the data from the POST

 * @param {object} req 
 * @param {function} cb 
 */
RequestCollector.prototype.preparePostData = function(req,cb)
{
    var postData = []
    req.on('data', function(chunk)
    {
        postData += chunk.toString();
    });

    req.on('end', function ()
    {
        cb(parse(postData));
    });
}

/**
 * parse the url
 * 
 * @param {object} req 
 * @returns {object}
 */
RequestCollector.prototype.getUrl = function(req)
{
    var queryString = url.parse(req.url,true);  
    return {
        protocol : req.connection.encrypted ? 'https': 'http',
        hostname : req.headers.host,
        port : req.connection.localPort,
        search : queryString.search,
        pathname : queryString.pathname,
        path : queryString.path,
        href : queryString.href
        };

}

/**
 * get specific info object from requestCollector
 * 
 * @param {string} parameter 
 * @returns {object}
 */
RequestCollector.prototype.getInfo = function(parameter='')
{

    var info = {
        method : this.method,
        created : this.created,
        score : this.score,
        secure : this.isSecure()
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

        case "query":
            info.query=this.query;
            break;


        default:
            info.body=this.body;
            info.files=this.files;
            info.headers=this.headers;
            info.cookies=this.cookies;
            info.url=this.url;
            info.query=this.query;
    }

    return info;

}


RequestCollector.prototype.getProtectedinfo = function()
{
    var info=this.getInfo();

    delete info.headers;
    delete info.cookies;
    delete info.files;
    delete info.body;

    return info;
}

RequestCollector.prototype.getShortInfo = function()
{
    var info = {
        method:this.method,
        url:this.url
    }
    return info;
}


RequestCollector.prototype.setScore = function(score)
{
    this.score=score;
}

RequestCollector.prototype.getScore = function()
{
    return this.score;
}

RequestCollector.prototype.isSecure = function()
{
    if(this.url){
        return (this.url.protocol==="https" || this.url.port == 443);
    }else{
        return '';
    }
}

// RequestCollector.prototype.setStatus = function(code)
// {
//     this.statusCode = code;
// }

// RequestCollector.prototype.getStatus = function()
// {
//     return this.statusCode;
// }


module.exports = RequestCollector;
