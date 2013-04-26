var connect = require('connect'),
	clc = require('cli-color'),
	os = require('os'),
	fs = require('fs'),
	path = require('path'),
	open = require('open');

module.exports = function(args) {

	var socket_io_injecter = function(req, res, next) {
		var INJECTED_CODE = fs.readFileSync(__dirname + '/reloader.html', 'utf8'),
			file,
			data;

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

	if(args == 'ar') {
		connect()
			.use(connect.compress())
			.use(socket_io_injecter)
			.use(connect.static(process.cwd(), {maxAge: 604800000}))
			.listen(3000);

	} else {
		connect()
			.use(connect.compress())
			.use(connect.static(process.cwd(), {maxAge: 604800000}))
			.listen(3000);
	}

	console.log(clc.cyan.bold('Server running on http://localhost:3000...'));

	var chrome = os.type() === 'Windows_NT' ? 'chrome' : 'google-chrome';

	open('http://localhost:3000', chrome);
};