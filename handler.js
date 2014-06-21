var jade = require('jade');
var fs = require('fs');
var url = require('url');
var marked = require('marked');
var mime = require('mime');
var qs = require('querystring');

function renderBlog(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var postNum = parseInt(url.parse(req.url).query);
	var jsCont = fs.readFileSync("posts.json", {encoding: "UTF8"});
	var posts = JSON.parse(jsCont);
	if (isNaN(postNum)) postNum = posts.posts.length;
	var options = posts.posts[postNum - 1];
	//console.log(options);
	options.text = marked(options.text);
	jade.renderFile('blog.jade', options, function (err, html) {
		if (err) throw err;
			//console.log(html);
			res.end(html);
	});
}

function mkArticle (req, res) {
	if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', function () {
            var post = qs.parse(body);

            console.log(post);
        });
	} else {
		res.end("use GET instead of POST");
	}
}

function handle (req, res) {
	var fname = "./" + req.url.slice(1, req.url.length);
	if (fs.existsSync(fname) && !fs.statSync(fname).isDirectory()) {
		console.log("http request for resource " + fname + ", mimetype " + mime.lookup(req.url));
		var mimet = mime.lookup(req.url);
		res.writeHead(200, {'Content-Type': mimet});
		var fvcCont = fs.readFileSync(fname, {encoding: "UTF8"});
		res.end(fvcCont);
	} else if (req.url == "/newf") {
		mkArticle(req, res);
	} else {
		renderBlog(req, res);
	}
}

exports.handle = handle;