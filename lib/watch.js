var chokidar = require('chokidar'),
	path = require('path'),
	clc = require('cli-color'),
	precompiler = require('./handlebars_precompiler'),
	moment = require('moment');

module.exports = function(paramData){
	var port = 1234 + parseInt(paramData.portOffset);
	var io = require('socket.io').listen(port, {log: false}),
		sockets = [],
		folder = paramData.templateFolder || '.';

	io.set('browser client minification', true);

	io.sockets.on('connection', function (socket) {
		sockets.push(socket);
		socket.on('disconnect', function() {
			sockets.splice(socket, 1);
		});
	});

	var watcher = chokidar.watch(process.cwd(), {ignored: /^\.|\~$/, ignoreInitial: true, persistent: true, interval: paramData.watchInterval});

	console.log(clc.cyan.bold('Watching folders and files for modifications...'));
	if(folder !== '.') {
		console.log(clc.cyan.bold('Templates folder is: ') + clc.green(folder));
	} else {
		console.log(clc.cyan.bold('Templates folder is: ') + clc.green(process.cwd()));
	}

	if (paramData.logChangedFiles) {
		console.log("\nLogging changed files... ");
	};

	watcher.on('all', function(event, file) {
		var pattern = /\/[.]/,
			fileExt = path.extname(file).replace('.','');
			if (paramData.logChangedFiles) {
				console.log(moment().format('[[]YYYY-MM-DD hh:mm:ss[]]') + ' ' + path.relative(process.cwd(), file));
			};
		if(!pattern.test(file)) {
			if(fileExt == 'tpl') {
				precompiler.precompile(folder, paramData.debugTemplates);
			} else {
				sockets.forEach(function(socket) {
					socket.emit('reload', { ext: fileExt});
				});
			}
		}
	});

	watcher.close();
};