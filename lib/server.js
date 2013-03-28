var clc = require('cli-color'),
watch = require('./watch'),
http = require('http'),
fs = require('fs'),
path = require('path'),
url = require('url'),
send = require('send'),
os = require('os'),
open = require('open'),
connect = require('connect');

module.exports = function(args) {
	var chrome = os.type() === 'Windows_NT' ? 'chrome' : 'google-chrome',
	WEBSOCKET_CLIENT = fs.readFileSync(__dirname + '/reloader.html', 'utf8');

	function escape(html){
		return String(html)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}
	function staticServer(root) {
		return function(req, res, next) {
			if ('GET' != req.method && 'HEAD' != req.method) return next();
			var reqpath = url.parse(req.url).pathname;

			function directory() {
				var pathname = url.parse(req.originalUrl).pathname;
				res.statusCode = 301;
				res.setHeader('Location', pathname + '/');
				res.end('Redirecting to ' + escape(pathname) + '/');
			}

			function error(err) {
				if (404 == err.status) return next();
				next(err);
			}

			function inject(stream) {
				var x = path.extname(reqpath);
				if (x === "" || x == ".html" || x == ".htm" || x == ".xhtml" || x == ".php") {
					var file,
						data,
						content;

					if(reqpath == "/") {
						file = fs.existsSync('index.html') ? 'index.html' : 'index.html';
					} else {
						file = reqpath.replace('/', '');
					}

					data = fs.readFileSync(file, 'utf8');
					content = data.replace('</body>', WEBSOCKET_CLIENT + '</body>');
					res.setHeader('Content-Length', content.length);
					res.end(content);
				}
			}

			if(args === "watch") {
				send(req, reqpath).root(root).on('error', error).on('stream', inject).on('directory', directory).pipe(res);
			} else {
				send(req, reqpath).root(root).on('error', error).on('directory', directory).pipe(res);
			}

		};
	}

	var directory = process.cwd();
	connect().use(staticServer(directory)).use(connect.directory(directory, {icons: true})).listen(3000);

	console.log(clc.cyan.bold('Server running on http://localhost:3000...'));

	if(args === "watch") {
		watch();
	}
	open('http://localhost:3000', chrome);
}