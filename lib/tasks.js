var watch = require('./watch'),
	server = require('./server'),
	_ = require('underscore'),
	clc = require('cli-color'),
	Table = require('cli-table');

module.exports = {
	tasksAllowed : ['init', 'i', 'generate', 'g', 'build', 'b', 'watch', 'w', 'server' , 's', 'developer', 'd', 'h', 'help'],
	execute: function(task, args) {

		if(this[task].aliasTo) {
			task = this[task].aliasTo;
		}

		this[task].that = this;

		if(this[task].processParams) {
			var paramData = this[task].processParams(args);
			this[task].run(paramData);
		} else {
			this[task].run(args);	
		}
	},
	checkParamExistence: function(args, param) {
		var index = args.indexOf(param);
		return (index >= 0);
	},
	getParamValue: function(args, param, defaultValue) {
		var index = args.indexOf(param);
		if(index >=0) {
			return args[index + 1];
		} else {
			return defaultValue;
		}
	},
	init: {
		description: 'Creates a new app',
		params: '',
		run: function() {
			/*
			With Backbone:
			1 - Folder Structure
			2 - index.html
			3 - .bowerrc

			Without Backbone:
			1, 2, 3
			4 - component.json
			5 - main.js
			6 - app.build.js
			*/
			console.log(module.exports.init.description);
		}
	},
	i: {
		aliasTo: 'init'
	},
	generate: {
		description: 'Generates code like Models, Collections and Views',
		params: '',
		run: function() {
			console.log(module.exports.generate.description);
		}
	},
	g: {
		aliasTo: 'generate'
	},
	build: {
		description: 'Prepares the app for production',
		params: '',
		run: function() {
			console.log(module.exports.build.description);
		}
	},
	b: {
		aliasTo: 'build'
	},
	watch: {
		description: 'Watch for changes in code',
		params: [
			{name: '-dt', description: 'Debug templates' },
			{name: '-lc', description: 'Log changed files' },
			{name: '-p <portOffset>', description: 'Server port offset' },
			{name: '-t <templateFolder>', description: 'Templates folder' },
			{name: '-wi <watchInterval>', description: 'Watch interval' }],
		run: function(paramData) {
			watch(paramData);
		},
		processParams: function(args) {
			return {
				templateFolder : this.that.getParamValue(args, '-t', null),
				portOffset: this.that.getParamValue(args, '-p', 0),
				watchInterval: this.that.getParamValue(args, '-wi', 1000),
				debugTemplates: this.that.checkParamExistence(args, '-dt'),
				logChangedFiles: this.that.checkParamExistence(args, '-lc')
			}
		}
	},
	w: {
		aliasTo: 'watch'
	},
	server: {
		description: 'Starts a web server for development',
		params: [
			{name: '-ar', description: 'Enable auto-reload' },
			{name: '-p <portOffset>', description: 'Server port offset' },
			{name: '-wi <watchInterval>', description: 'Watch interval' }],
		run: function(paramData) {
			server(paramData);
		},
		processParams: function(args) {
			return {
				autoReload : this.that.checkParamExistence(args, '-ar'),
				portOffset: this.that.getParamValue(args, '-p', 0)
			}
		}
	},
	s: {
		aliasTo: 'server'
	},
	developer: {
		description: 'Starts a server and watch for changes in code',
		params: [
			{name: '-ar', description: 'Enable auto-reload'},
			{name: '-dt', description: 'Debug templates' },
			{name: '-lc', description: 'Log changed files' },
			{name: '-p <portOffset>', description: 'Server port offset' },
			{name: '-t <templateFolder>', description: 'Templates folder' },
			{name: '-wi <watchInterval>', description: 'Watch interval' }],
		run: function(args) {
			this.that.execute('s', args);
			this.that.execute('w', args);
		}
	},
	d: {
		aliasTo: 'developer'
	},
	help: {
		description: 'Show tasks help',
		params: [
			{name: '<taskName>...', description: 'Show task help' }],
		run: function(args) {
			var tasks = this.that;

			console.log(clc.red.bold(" ____                    __    __           _       _        "));
			console.log(clc.red.bold("/ ___|    ___    __ _   / _|  / _|   ___   | |   __| |  _ __ "));
			console.log(clc.red.bold("\\___ \\   / __|  / _` | | |_  | |_   / _ \\  | |  / _` | | '__|"));
			console.log(clc.red.bold(" ___) | | (__  | (_| | |  _| |  _| | (_) | | | | (_| | | |   "));
			console.log(clc.red.bold("|____/   \\___|  \\__,_| |_|   |_|    \\___/  |_|  \\__,_| |_|   "));
			console.log(clc.red.bold("-------------------------------------------------------------"))
			console.log(clc.red.bold(' TASK LIST'));
			console.log(clc.red.bold("-------------------------------------------------------------"))

			var commandList;
			if(args.length > 0) {
				commandList = args;
				_.each(commandList, function(e) {
					if(!tasks[e]) {
						commandList = _.without(commandList, e);
					} else if(tasks[e].aliasTo) {
						commandList[commandList.indexOf(e)] = tasks[e].aliasTo;
					}	

				})
			} else {
				commandList = tasks.tasksAllowed;
			}

			console.log();
			_.each(commandList, function(e) {
				var task = tasks[e];

				if(!task.aliasTo) {
					console.log(clc.cyan.bold('Task Name: ') + clc.white.bold(e));
					var aliases = "";
					_.each(tasks.tasksAllowed, function(el) {
						if(tasks[el].aliasTo == e) {
							aliases += el + " ";
						}
					})
					console.log(clc.cyan.bold('Aliases: ') + clc.white.bold(aliases));
					console.log(clc.cyan.bold('Description: ') + clc.white.bold(task.description));


					if(task.params.length > 0) {
						var table = new Table({
							head: [clc.cyan.bold('Parameter'), clc.cyan.bold('Description')],
							colWidths: [21, 51],
							style: {compact:true, 'padding-left': 1}
						});

						_.each(task.params, function(parameter) {
							table.push([clc.white.bold(parameter.name), clc.white.bold(parameter.description)]);
						});

						console.log(table.toString());
					}
					console.log("\n");
				}

			});
		}
	},
	h: {
		aliasTo: 'help'
	}
};
