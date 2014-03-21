var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var middleware = require('./../helpers/middleware');
var db = require('./mysqlHelpers');

var serve404;


exports.getRoutes = function(req, res){
  if(routes[req.pathname]){
    routes[req.pathname](req,res);
  } else{
    var url = req.pathname.replace(/^\//, "").replace(/http(s)?:\/\//, "").replace(/\/$/, "");
    //middleware.staticServe(__dirname+'/../archives/sites' + url, res, "", serve404);
    db.getHtml(url,function(err,rows){
      if(!!err || rows.length === 0){
        serve404(req,res);
      }else {
        if(rows[0].html){
          res.send(rows[0].html);
        } else {
          serve404(req, res);
        }
      }
    });
  }
};

var errorOccurred = function(req, res){
  res.status(500).send("Sorry an error occurred");
};

var serveIndex = function(req, res){
  middleware.staticServe(__dirname+'/public/index.html', res, "", errorOccurred);
};

var serveLoading = function(req, res){
  middleware.staticServe(__dirname+'/public/loading.html', res, "", errorOccurred);
};

var routes = {
  '/' : serveIndex,
  '/loading' : serveLoading
};

exports.serve404 = serve404 = function(req, res){
  res.redirect("/404.html");
  //middleware.staticServe(__dirname+'/public/404.html', res, "", errorOccurred);
};