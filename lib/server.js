var connect = require('connect'),
	clc = require('cli-color'),
	os = require('os'),
	open = require('open');

module.exports = function(args) {

	var chrome = os.type() === 'Windows_NT' ? 'chrome' : 'google-chrome';

	connect()
		.use(connect.compress())
		.use(connect.static(process.cwd(), {maxAge: 604800000}))
		.listen(3000);

	console.log(clc.cyan.bold('Server running on http://localhost:3000...'));

	open('http://localhost:3000', chrome);
}