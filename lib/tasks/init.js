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

		//Cria o arquivo index.html
		createIndex();

		// Cria o arquivo main.css
		createMainCSS();

		// Cria o arquivo bowerrc
		createBowerConf();

		// Cria o arquivo component.json
		createComponentJSON();

		// Baixa as dependencias
		installDeps();

		// Cria o arquivo main.js
		createRequireMain();
	});
};

var sobreescreverDirQuestion = {
	question: 'O diretório já existe. Sobreescrever? (s/N)',
	format: /^s$|^n$/i,
	error: 'Favor informar "S" para sim ou "N" para não!',
	defaultValue: 'n'
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

var createIndex = function() {

	var template = [
		'<!doctype html>',
		'<html lang="pt-br">',
		'<head>',
	    '    <meta charset="UTF-8">',
	    '    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">',
	    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
	    '    <title>App</title>',
	    '    <link rel="stylesheet" href="css/main.css">',
		'</head>',
		'<body>',
		'',
	    '    <script data-main="js/main" src="js/libs/require/require.js"></script>',
		'</body>',
		'</html>'
	].join("\n");

	fs.outputFile("app/index.html", template, function() {
		console.log(clc.cyanBright.bold("Arquivo index.html criado com sucesso!\n"));
	});
}.async();

var createMainCSS = function() {
	var template = "/* main.css */";

	fs.outputFile("app/css/main.css", template, function() {
		console.log(clc.cyanBright.bold("Arquivo main.css criado com sucesso!\n"));
	});
}.async();

var createComponentJSON = function() {
	var template = {
		"dependencies": {
			"jquery": null,
			"require": null,
			"text": null,
			"backbone-amd": null,
			"underscore-amd": null,
			"backbone.marionette": null,
			"handlebars": null
		}
	}

	fs.writeJSONSync('./component.json', template);

	console.log(clc.cyanBright.bold("Arquivo component.json criado com sucesso!\n"));
}.async();

var createBowerConf = function() {
	var template = {
		"directory": "app/js/libs"
	}

	fs.writeJSONSync('./.bowerrc', template);

	console.log(clc.cyanBright.bold("Arquivo .bowerrc criado com sucesso!\n"));
}.async();

var createRequireMain = function() {
	var template = [
		"require.config({",
	    "    paths: {",
		"        'jquery'     : 'libs/jquery/jquery',",
		"        'handlebars' : 'libs/handlebars/handlebars.runtime',",
		"        'text'       : 'libs/text/text',",
		"        'underscore' : 'libs/underscore-amd/underscore',",
		"        'backbone'   : 'libs/backbone-amd/backbone',",
		"        'marionette' : 'libs/backbone.marionette/lib/backbone.marionette'",
		"    }",
		"});",
		"",
		"require([], function() {",
		"console.log('App iniciada!')",
		"});"
	].join("\n");

	fs.outputFile("app/js/main.js", template, function() {
		console.log(clc.cyanBright.bold("Arquivo main.js criado com sucesso!\n"));
	});

}.async();

var installDeps = function() {
	var bower = spawn('bower', ['install']);

	console.log(clc.cyanBright.bold("\nInstalando dependências!\n"));

	bower.stdout.on('data', function (data) {
		process.stdout.write(data);
	});

	bower.stderr.on('data', function (data) {
		console.log(data);
	});

	bower.on('exit', function (code) {
		if(code === 0) {
			console.log(clc.cyanBright.bold("\nDependências instaladas com sucesso!\n"));
		}
	});
}.async();