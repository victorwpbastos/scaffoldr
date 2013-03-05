var _ = require('underscore'),
	clc = require('cli-color'),
	tasks = require('./tasks/tasks'),
	generators = require('./generators');

module.exports	= {
	welcome: function() {
		console.log(clc.red.bold(" ____                    __    __           _       _        "));
		console.log(clc.red.bold("/ ___|    ___    __ _   / _|  / _|   ___   | |   __| |  _ __ "));
		console.log(clc.red.bold("\\___ \\   / __|  / _` | | |_  | |_   / _ \\  | |  / _` | | '__|"));
		console.log(clc.red.bold(" ___) | | (__  | (_| | |  _| |  _| | (_) | | | | (_| | | |   "));
		console.log(clc.red.bold("|____/   \\___|  \\__,_| |_|   |_|    \\___/  |_|  \\__,_| |_|   "));

		console.log(clc.cyanBright.bold.underline("\nTarefas\n"));

		_.each(tasks.exposed, function(task) {
			console.log(clc.bold(task) + ": " + tasks[task].description);
			console.log("-- Exemplo: " + clc.red.bold("scaff") + " " + tasks[task].example + "\n");
		});

		console.log(clc.cyanBright.bold.underline("\nGeradores\n"));

		_.each(generators.exposed, function(generator) {
			console.log(clc.bold(generator) + ": " + generators[generator].description);
			console.log("-- Exemplo: " + clc.red.bold("scaff") + " " + generators[generator].example + "\n");
		});
	},
	showTasks: function() {
		console.log(tasks.exposed);
	}
}