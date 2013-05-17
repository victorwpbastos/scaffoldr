var watch = require('./watch'),
	server = require('./server');

module.exports = {
	tasksAllowed : ['init', 'i', 'generate', 'g', 'build', 'b', 'watch', 'w', 'server' , 's'],
	init: {
		description: 'Creates a new app',
		run: function() {
			/*
			App sem Backbone:
			1 - Estrutura de pastas
			2 - index.html
			3 - .bowerrc

			App com Backbone:
			1, 2, 3
			4 - component.json
			5 - main.js
			6 - app.build.js
			*/
			console.log(module.exports.init.description);
		}
	},
	i: {
		run: function() {
			module.exports.init.run();
		}
	},
	generate: {
		description: 'Generates code like Models, Collections and Views',
		run: function(args) {
			console.log(module.exports.generate.description);
			console.log(args);
		}
	},
	g: {
		run: function(arg) {
			module.exports.generate.run(args);
		}
	},
	build: {
		description: 'Prepares the app for production',
		run: function() {
			console.log(module.exports.build.description);
		}
	},
	b: {
		run: function() {
			module.exports.build.run();
		}
	},
	watch: {
		description: 'Watch for changes in code',
		run: function(args) {
			watch(args);
		}
	},
	w: {
		run: function(args) {
			module.exports.watch.run(args);
		}
	},
	server: {
		description: 'Starts a web server for development',
		run: function(args) {
			server(args);
		}
	},
	s: {
		run: function(args) {
			module.exports.server.run(args);
		}
	}
};