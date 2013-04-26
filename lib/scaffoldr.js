#!/usr/bin/env node
var _ = require('underscore'),
	Table = require('cli-table'),
	clc = require('cli-color'),
	tasks = require('./tasks'),
	task = process.argv.slice(2)[0],
	args = process.argv.slice(2)[1];

var showHelp = function() {
	console.log(clc.red.bold(" ____                    __    __           _       _        "));
	console.log(clc.red.bold("/ ___|    ___    __ _   / _|  / _|   ___   | |   __| |  _ __ "));
	console.log(clc.red.bold("\\___ \\   / __|  / _` | | |_  | |_   / _ \\  | |  / _` | | '__|"));
	console.log(clc.red.bold(" ___) | | (__  | (_| | |  _| |  _| | (_) | | | | (_| | | |   "));
	console.log(clc.red.bold("|____/   \\___|  \\__,_| |_|   |_|    \\___/  |_|  \\__,_| |_|   ")+'\n');

	var table = new Table({
		head: ['Task', 'Alias', 'Description'],
		colWidths: [15, 7, 50],
		style: {compact:true, 'padding-left': 1, head: ['green']}
	});

	_.each(tasks.tasksAllowed, function(task) {
		if(task.length > 1) {
			table.push(
				[task, task.charAt(0), tasks[task].description]
			);
		}
	});

	console.log(table.toString()+'\n');
};



if(!task) {
	showHelp();
} else {
	if(_.contains(tasks.tasksAllowed, task)) {
		tasks[task].run(args);
	} else {
		console.log('task not allowed!');
	}
}