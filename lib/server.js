var connect = require('connect'),
	clc = require('cli-color'),
	os = require('os'),
	fs = require('fs'),
	path = require('path'),
	open = require('open');

module.exports = function(paramData) {
	var port = 3000 + parseInt(paramData.portOffset);
	var watchPort = 1234 + parseInt(paramData.portOffset);
	var socket_io_injecter = function(req, res, next) {
		var INJECTED_CODE = fs.readFileSync(__dirname + '/reloader.html', 'utf8'),
			file,
			data;

		INJECTED_CODE = INJECTED_CODE.replace(/THE_PORT/g, watchPort);

		if(req.url == '/') {
			file = fs.existsSync('index.html') ? 'index.html' : 'index.htm';
		} else {
			file = req.url.split('/')[1];
		}

		if(path.extname(file) == '.html' || path.extname(file) == '.htm') {
			data = fs.readFileSync(file, 'utf8');
			data = data.replace('</head>', INJECTED_CODE + '</head>');
			res.setHeader('Content-Length', data.length);
			res.end(data);
		} else {
			next();
		}
	};

	if(paramData.autoReload) {
		connect()
			.use(connect.compress())
			.use(socket_io_injecter)
			.use(connect.static(process.cwd()))
			.listen(port);

	} else {
		connect()
			.use(connect.compress())
			.use(connect.static(process.cwd(), {maxAge: 604800000}))
			.listen(port);
	}

	console.log(clc.cyan.bold('Server running on http://localhost:' + port + '...'));

	var chrome = os.type() === 'Windows_NT' ? 'chrome' : 'google-chrome';
	open('http://localhost:' + port, chrome);
};