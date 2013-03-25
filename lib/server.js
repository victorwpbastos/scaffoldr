var clc = require('cli-color'),
	watch = require('./watch'),
	http = require('http'),
	fs = require('fs'),
	path = require('path'),
	send = require('send'),
	os = require('os'),
	open = require('open'),
	chrome = os.type() === 'Windows_NT' ? 'chrome' : 'google-chrome';

module.exports = function(args) {
	var WEBSOCKET_CLIENT = fs.readFileSync(__dirname + '/reloader.html', 'utf8');

	http.createServer(function(req, res) {
		function injectWebSocketClient(stream) {
			var ext = path.extname(req.url);
			if (ext === "" || ext == ".html" || ext == ".htm" || ext == ".xhtml") {
				var data = fs.readFileSync('index.html', 'utf8');
				var content = data.replace("</body>", WEBSOCKET_CLIENT + '</body>');
				res.setHeader('Content-Length', content.length);
				res.write(content);
			}
		}

		send(req, req.url)
			.root(process.cwd())
			.on('stream', injectWebSocketClient)
			.pipe(res);

	}).listen(3000);
	console.log(clc.cyan.bold('Server running on http://localhost:3000...'));

	if(args === "watch") {
		watch();
	}

	open('http://localhost:3000', chrome);
}