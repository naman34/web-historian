var db = require('./mysqlHelpers');

exports.index = function(req,res,next){
  console.log(req.body);

  //if url does not exist or is not a url.
  if(!req.body.url || !req.body.url.match(/^(http:\/\/|https:\/\/)?(www\.)?[\w]+\.(com|net|in|io|org|me|ng|co\.uk|us|mx|edu|cn|gov)\/?$/)){
    next(req,res);
  } else {
    var url = req.body.url.replace(/http(s)?:\/\//, "").replace(/\/$/g, "");
    db.saveUrl(url,function(err,result){
      if(!!err){
        return res.status(500).send("an error occurred");
      }
      if(result === "exists"){
        return res.redirect("/"+url);
      }

      if(result === "waiting" || !!result){
        return res.redirect("/loading.html");
      }

    });
  }

};