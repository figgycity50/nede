var http = require('http');
var blogHandler = require('./handler');

http.createServer(function (req, res) {
	blogHandler.handle(req, res);
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');