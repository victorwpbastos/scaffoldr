var chokidar = require('chokidar'),
	path = require('path'),
	clc = require('cli-color'),
	precompiler = require('./handlebars_precompiler');

module.exports = function(args){
	var io = require('socket.io').listen(1234, {log: false}),
		sockets = [],
		folder = args || '.';

	io.set('browser client minification', true);

	io.sockets.on('connection', function (socket) {
		sockets.push(socket);
		socket.on('disconnect', function() {
			sockets.splice(socket, 1);
		});
	});

	var watcher = chokidar.watch(process.cwd(), {ignored: /^\.|\~$/, ignoreInitial: true, persistent: true});

	console.log(clc.cyan.bold('Watching folders and files for modifications...'));
	if(folder !== '.') {
		console.log(clc.cyan.bold('Templates folder is: ') + clc.green(folder));
	} else {
		console.log(clc.cyan.bold('Templates folder is: ') + clc.green(process.cwd()));
	}

	watcher.on('all', function(event, file) {
		var pattern = /\/[.]/,
			fileExt = path.extname(file).replace('.','');

		if(!pattern.test(file)) {
			precompiler.precompile(folder);

			sockets.forEach(function(socket) {
				socket.emit('reload', { ext: fileExt});
			});
		}
	});

	watcher.close();
};