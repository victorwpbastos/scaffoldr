var chokidar = require('chokidar'),
	fs = require('fs'),
	path = require('path'),
	clc = require('cli-color'),
	handlebars = require('handlebars');

module.exports = function(){

	var WebSocketServer = require('ws').Server;

	connections = [];
	var that = this;

  	var wss = new WebSocketServer({host:'localhost', port: 1234});
	wss.on('connection', function(connection) {
		that.connections.push(connection);
        connection.on('close', function() {
			that.connections.splice(connection, 1);
        });
	});

	var watcher = chokidar.watch(process.cwd(), {ignored: /^\.|\~$/, ignoreInitial: true, persistent: true});

	console.log(clc.cyan.bold('Watching app/templates for modifications...'));

	watcher.on('all', function(event, path) {
		pattern = /\/[.]/;
		if(!pattern.test(path)) {
			precompileTemplates();
			connections.forEach(function(connection) {
				if(connection.readyState === 1) {
					connection.send('reload');
				}
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