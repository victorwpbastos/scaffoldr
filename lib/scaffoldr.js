#! /usr/bin/env node

var _ = require('underscore'),
	clc = require('cli-color'),
	fs = require('fs'),
	utils = require('./utils'),
	tasks = require('./tasks/tasks'),
	Sync = require('sync');

// var arguments = process.argv[2];
var args = process.argv.slice(2);

if(args.length === 0) {
	utils.welcome();
	return;
}

var exists = _.contains(tasks.exposed, args[0]);
if(exists) {
	tasks[args[0]].run(args.splice(1));
} else {
	console.log(clc.red.bold("Tarefa não disponível! Tente alguma das tarefas abaixo:"));
	utils.showTasks();
}
// tasks[arguments].run();
// var exist = _.contains(tasks.exposed, arguments);