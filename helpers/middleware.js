var url = require('url');
var fs = require('fs');
var _ = require('underscore');
var util = require('util');

var keyval = function(keyVal){
  keyVal = keyVal.split('=');
  if(keyVal.length !== 2 || !keyVal[0]){
    return null;
  }
  var obj = {};
  obj[decodeURIComponent(keyVal[0])] = decodeURIComponent(keyVal[1]);
  return obj;
};

exports.parsePost = function(req,res,next){

    var body = "";
    req.on('data',function(value){
      body += value;
    });
    req.on('end',function(){
      body = body.split('&');
      body = body.map(keyval);
      body = body.filter(function(value){
        return !!value;
      });
      var obj = {};
      body.forEach(function(pair){
        _.extend(obj, pair);
      });
      body = obj;

      console.log("parsePOST", body);
      req.body = body;

      next(req, res);
    });

};

exports.parseQuery = function(req, res, next){
  var queryObject = url.parse(req.url);

  req.parsedQuery = queryObject;
  req.pathname = queryObject.pathname;
  req.query = queryObject.query;
  if(!!queryObject.query){
    queryObject.query = queryObject.query.split("&");

    queryObject.query = queryObject.query.map(keyval);

    queryObject.query = queryObject.query.filter(function(value){
      return !!value;
    });

    var obj = {};
    queryObject.query.forEach(function(pair){
      _.extend(obj, pair);
    });
    queryObject.query = obj;

    req.queryParams = queryObject.query;
  }

  res._status = 200;
  res.status = function(num){
    this._status = num;
    return this;
  };
  res.headers = {};

  res.set = function(obj){
    _.extend(this.headers, obj);
    return this;
  };

  res.send = function(data){
    res.writeHead(this._status,this.headers);
    res.end(data);
  };

  res.redirect = function(url){
    res.set({Location:url});
    res.status(302).send();
  };

  next(req, res);
};

exports.staticServe = function(req,res,basePath,next){
  if(typeof req === "string"){
    req = {pathname : req};
  }
  fs.exists(basePath+req.pathname, function (exists) {
    if(!exists){
      return next(req,res);
    }else{
      var encodeOBJ = {encoding: "utf-8"};

      fs.readFile(basePath+req.pathname, encodeOBJ, function(error,data){
        if(!!error || !data){
          return next(req,res);
        }
        var ext = req.pathname.slice(req.pathname.lastIndexOf(".")+1);
        if(mimes[ext]){
          res.set({'Content-Type': mimes[ext]});
        }
        res.send(data);
      });
    }
  });
};

var mimes = {
  "css" : "text/css",
  "jpg" : "image/jpg",
  "jpeg": "image/jpg",
  "gif" : "image/gif",
  "png" : "image/png",
  "txt" : "text/plain"
};

