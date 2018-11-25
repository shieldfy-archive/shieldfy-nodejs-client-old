// const express = require('express');
// const app = express();
// var bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// var multer  = require('multer')
// var upload = multer().any();


function RequestCollector(req) {

  this.method=req.method;
  this.created=Date();
  // this.ip=req.ip;

  this.cookies=req.cookies;

  this.headers=req.headers;

  // this.url=req.url
  this.url={
    protocol:req.protocol,
    hostname:req.hostname,
    path:req.path,
    baseUrl:req.baseUrl,
    orignalUrl:req.originalUrl
  };

  this.data={
    parm:req.params,
    query:req.query,
    body:req.body
  };

  this.files=(req.files)? req.files : req.file;
}

RequestCollector.prototype.getInfo=function (parameter='') {
  var info = {
    method : this.method,
    created : this.created,
    score : this.score,
    // ip : this.ip
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

      case "files":
        info.files=this.files
        break;

      default:
      info.files=this.files
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
  delete info.files;

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
