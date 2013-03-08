var clc = require('cli-color'),
	fs = require('fs-extra'),
	prompt = require('../prompt'),
	_ = require('underscore'),
	spawn = require('child_process').spawn,
	Sync = require('sync');

module.exports = function(args) {
	var appName, withBackbone;

	Sync(function() {
		// Cria a estrutura de diretorios
		createDirs();

		// Cria o package.json
		createPackageJSON();

		// Baixa as dependencias
		installDeps();
	});
};

var withBackboneQuestion = {
	question: 'Aplicação com Require e Backbone? (S/n)',
	format: /^s$|^n$|^sim$|^não$/i,
	error: 'Favor informar "S" para sim ou "N" para não!',
	defaultValue: 's'
}

var sobreescreverDirQuestion = {
	question: 'O diretório já existe. Sobreescrever? (s/N)',
	format: /^s$|^n$/i,
	error: 'Favor informar "S" para sim ou "N" para não!',
	defaultValue: 'n'
}

var congelarDepsQuestion = {
	question: 'Deseja congelar a versão das dependências? (S/n)',
	format: /^s$|^n$/i,
	error: 'Favor informar "S" para sim ou "N" para não!',
	defaultValue: 's'
}

var createDirs = function() {

	var dirs = ["app/js/libs", "app/js/collections", "app/js/models", "app/js/views", "app/css", "app/img", "app/templates"],
		dirExists;

	console.log(clc.cyanBright.bold("\nCriando estrutura de diretórios\n"));
	_.each(dirs, function(dir, index, list) {
		dirExists = fs.existsSync(dir);
		ultima = index === list.length - 1 ? true : false;

		sobreescreverDirQuestion.question = "O diretório " + clc.red.bold(dir) + " já existe. Sobreescrever? (s/N)";

		if(dirExists && !ultima) {
			var res = /^s$/i.test(prompt.sync(null, sobreescreverDirQuestion, false)) ? true : false;
			if(res){
				fs.removeSync(dir);
				fs.mkdirsSync(dir);
			}
		} else if(!dirExists && !ultima) {
			fs.mkdirsSync(dir);
			console.log("Diretório " + clc.cyanBright.bold(dir) + " ok!");
		} else if(dirExists && ultima) {
			var res = /^s$/i.test(prompt.sync(null, sobreescreverDirQuestion, true)) ? true : false;
			if(res){
				fs.removeSync(dir);
				fs.mkdirsSync(dir);
			}
			console.log("");
		} else {
			fs.mkdirsSync(dir);
			console.log("Diretório " + clc.cyanBright.bold(dir) + " ok!");
			console.log(clc.cyanBright.bold("\nEstrutura de diretórios criada com sucesso!\n"));
		}
	});

}.async();

var createPackageJSON = function() {

	var template = {
		"name": "",
		"description": "",
		"version": "1.0.0",
		"volo": {
			"baseUrl": "app/js/libs",
			"dependencies": {
				"require": "requirejs",
				"text": "requirejs/text",
				"jquery": "jquery",
      			"underscore": "documentcloud/underscore",
      			"backbone": "documentcloud/backbone",
      			"backbone.marionette": "https://github.com/marionettejs/backbone.marionette/blob/master/lib/backbone.marionette.js",
      			"handlebars.runtime": "https://github.com/wycats/handlebars.js/blob/master/dist/handlebars.runtime.js"
			}
		}
	}

	console.log(clc.cyanBright.bold("Criando arquivo package.json\n"));

	fs.writeJSONSync('./package.json', template);

	console.log(clc.cyanBright.bold("Arquivo package.json criado com sucesso!\n"));

}.async();

var installDeps = function() {
	var volo, res;

	res = /^s$/i.test(prompt.sync(null, congelarDepsQuestion, true)) ? true : false;

	if(res) {
		volo = spawn('volo', ['install', '-skipexists']);
	} else {
		volo = spawn('volo', ['install', '-skipexists', '-nostamp']);
	}

	console.log(clc.cyanBright.bold("\nBaixando dependências!\n"));

	volo.stdout.on('data', function (data) {
		process.stdout.write(data);
	});

	volo.stderr.on('data', function (code) {
		console.log(data);
	});

	volo.on('exit', function (code) {
		if(code === 0) {
			console.log(clc.cyanBright.bold("\nDependências baixadas com sucesso!\n"));
		}
	});
}.async();