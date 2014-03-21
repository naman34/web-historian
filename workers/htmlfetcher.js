var http = require('http');
var db = require('./../web/mysqlHelpers');

var fetchHTML = function(url, callback){

  var options = {
    hostname: url,
    port: 80,
    path: '/',
    method: 'GET'
  };

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var body = "";
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
      body += chunk;
    });
    res.on('end', function(){
      console.log(body);
      callback(null, body);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    callback(e.message);
  });

  req.end();

};

db.getUnsavedUrls(function(err,rows){
  if(!!err){
    return console.log("an error occurred, will try again in a minute");
  }
  setTimeout(function(){
    process.exit();
  }, 20000);
  rows.forEach(function(row){
    var url = row.url.replace(/^\//, "").replace(/http(s)?:\/\//, "").replace(/\/$/, "");
    fetchHTML(url, function(err, html){
      if(!err){
        db.setHtml(url, html, function(err, status){
          console.log(err, status);
        });
      }
    });
  });

});