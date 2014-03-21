var http = require("http");
var handler = require("./request-handler");

var port = 8080;
var server = http.createServer(handler.handleRequest);
console.log("Listening on port: " + port);
server.listen(port);

