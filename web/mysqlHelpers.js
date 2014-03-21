var mysql = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'plantlife',
  database : 'archive'
});


var getUnsavedUrls = function(callback){

  var sqlQuery = 'SELECT * FROM data WHERE exist = 0';

  pool.query(sqlQuery, function(err,rows){
    if(!!err){
      console.log("error querying db");
      callback(err);
    }else{
      callback(null,rows);
    }
  });

};

exports.getUnsavedUrls = getUnsavedUrls;

var saveUrl = function(url, callback){
  var sqlQuery = "SELECT * FROM data WHERE url = ?";

  pool.query(sqlQuery, [url], function(err,rows){
    if(!!err){
      console.log("error querying db");
      callback(err);
    }else if(rows.length !== 0){
      if(rows[0].exist){
        callback(null, "exists");
      } else {
        console.log("already there, waiting...");
        callback(null, "waiting");
      }
    }else{
      var insertQuery = 'INSERT INTO data (url) values (?)';
      pool.query(insertQuery, [url], function(err,rows){
        if(!!err){
          console.log("error in adding stuff");
        }
        console.log("added somthing in.");
        callback(err, rows);
      });
    }
  });
};

exports.saveUrl = saveUrl;

var getHtml = function(urlOrId, callback){

  var sqlQuery = "Select html from data where ";
  if(typeof urlOrId === 'string'){
    sqlQuery += 'url = ?';
  } else {
    sqlQuery += 'id = ?';
  }

  pool.query(sqlQuery,[urlOrId],function(err,rows){
    if(!!err){
      console.log("error querying db");
      callback(err);
    }else{
      callback(null,rows);
    }
  });
};

exports.getHtml = getHtml;

var setHtml = function(urlOrId, html, callback){
  var sqlQuery = "Select * from data where ";
  if(typeof urlOrId === 'string'){
    sqlQuery += 'url = ?';
  } else {
    sqlQuery += 'id = ?';
  }

  pool.query(sqlQuery, [urlOrId], function(err,rows){
    if(!!err){
      console.log("error querying db");
      callback(err);
    } else if(rows.length === 0) {
      saveUrl(urlOrId, function(err, results){
        setHtml(urlOrId, html, callback);
      });
    } else {
      sqlQuery = "UPDATE data SET html=?, exist=1 WHERE id =" + rows[0].id;
      pool.query(sqlQuery, [html], function(err,rows){
        callback(err, rows);
      });
    }
  });
};

exports.setHtml = setHtml;