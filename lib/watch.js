var chokidar = require('chokidar'),
	fs = require('fs'),
	path = require('path'),
	clc = require('cli-color'),
	handlebars = require('handlebars');

module.exports = function(){
	var io = require('socket.io').listen(1234),
		sockets = [];

	io.set('log level', 0);
	io.set('browser client minification', true);

	io.sockets.on('connection', function (socket) {
		sockets.push(socket);
		socket.on('disconnect', function() {
			sockets.splice(socket, 1);
		});
	});

	var watcher = chokidar.watch(process.cwd(), {ignored: /^\.|\~$/, ignoreInitial: true, persistent: true});

	console.log(clc.cyan.bold('Watching templates for modifications...'));

	watcher.on('all', function(event, file) {
		var pattern = /\/[.]/,
		fileExt = path.extname(file).replace('.','');

		if(!pattern.test(file)) {
			if(fileExt == 'tpl') {
				precompileTemplates();
			}
			sockets.forEach(function(socket) {
				socket.emit('reload', { ext: fileExt});
			});
		}
	});

	watcher.close();

	var precompileTemplates = function() {
		var templates = fs.readdirSync('app/templates'),
			isFolder,
			isPartial,
			output = [];

		output.push('(function() {\n  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n');

		templates.forEach(function(filePath) {
			isFolder = fs.statSync('app/templates/' + filePath).isDirectory();
			if(isFolder) {
				var files = fs.readdirSync('app/templates/' + filePath);
				files.forEach(function(template) {
					isPartial = template.charAt(0) == '_' ? true : false;
					doPrecompile(filePath + '/' + template, 'app/templates/' + filePath + '/' + template, isPartial);
				});
			} else {
				isPartial = filePath.charAt(0) == '_' ? true : false;
				doPrecompile(filePath, 'app/templates/' + filePath, isPartial);
			}
		});

		output.push('})();');
		output = output.join('');
		fs.writeFileSync('app/templates/templates.js', output, 'utf8');

		function doPrecompile(fileName, file, isPartial) {
			if(path.extname(file) === '.tpl') {
				var data = fs.readFileSync(file, 'utf8');

				if(isPartial) {
					output.push('Handlebars.partials[\'' + fileName + '\'] = template(' + handlebars.precompile(data) + ');\n');
				} else {
					output.push('templates[\'' + fileName + '\'] = template(' + handlebars.precompile(data) + ');\n');
				}
			}
		};
	};
};