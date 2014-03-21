var path = require('path');
var middleware = require('./../helpers/middleware');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var postRoutes = require('./postRoutes');

// require more modules/folders here!
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.handleRequest = function (req, res) {

  middleware.parseQuery(req, res, function(req, res){
    res.set(headers);
    if(req.method === "POST"){
      middleware.parsePost(req,res, function(req,res){
        postRoutes.index(req,res, httpHelpers.serve404);
      });
    }else if(req.method === "GET"){
      middleware.staticServe(req,res, __dirname + "/public", httpHelpers.getRoutes);
    }else{
       console.log(a);
       httpHelpers.serve404(req,res);
    }
  });

};

