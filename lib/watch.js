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
		})
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
			data,
			output = [];

		output.push('(function() {\n  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n');

		templates.forEach(function(template) {
			if(path.extname(template) === '.tpl') {
				data = fs.readFileSync('app/templates/' + template, 'utf8');
				data = data.length > 0 ? data : " ";
				output.push('templates[\'' + template + '\'] = template(' + handlebars.precompile(data) + ');\n');
			}
		});

		output.push('})();');
		output = output.join('');
		fs.writeFileSync('app/templates/templates.js', output, 'utf8');
	}
}