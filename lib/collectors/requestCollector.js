var url = require('url');

var Busboy = require('busboy');

function RequestCollector(req,cb) {
  var _this = this;

  this.method=req.method;
  this.created=Date();
  this.headers=req.headers;
  this.url=this.getUrl(req)
  this.cookies=req.cookies;//
  this.data={};
  
  // query:url.parse(req.url, true).query

  this.getData(req, function (dataObj) {
    _this.data.query=url.parse(req.url, true).query;
    _this.data.body = dataObj.body;
    _this.data.files = dataObj.files;
    cb();
  });
}

RequestCollector.prototype.getData=function (req,cb) {
  var FORM_TYPE="multipart/form-data";
  dataObj={
    files:[],
    body:{}
  }
  if(req.headers["content-type"].indexOf(FORM_TYPE)!==-1){

    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var size=0;
      file.on('data', function(data) {
        size+=data.length
      });
      file.on('end', function() {
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

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      dataObj.body[fieldname]=val
    });

    busboy.on('finish', function() {
      cb(dataObj);
    });

    req.pipe(busboy);

  }else{

    var tempData = []
    req.on('data', function(chunk)  {
      tempData += chunk.toString();
      });
      req.on('end', function () {
        dataObj.body=tempData
          cb(dataObj);
        });

  }
}

RequestCollector.prototype.getUrl=function (req) {
  return {
      protocol:req.protocol,
      hostname:req.hostname,
      path:req.path,
      baseUrl:req.baseUrl,
      orignalUrl:req.originalUrl
    };
}

RequestCollector.prototype.getInfo=function (parameter='') {
  var info = {
    method : this.method,
    created : this.created,
    score : this.score,
  }

  switch (parameter) {
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


RequestCollector.prototype.getProtectedinfo=function () {
  var info=this.getInfo();

  delete info.headers;
  delete info.cookies;

  return info;
}

RequestCollector.prototype.getShortInfo=function () {
  var info={
    method:this.method,
    url:this.url
  }
  return info;
}

RequestCollector.prototype.setScore=function (score) {
  this.score=score;
}

RequestCollector.prototype.getScore=function () {
  return this.score;
}

RequestCollector.prototype.isSecure=function () {
  return (this.url.protocol==="https");
}

module.exports = RequestCollector;
