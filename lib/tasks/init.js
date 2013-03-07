var clc = require('cli-color'),
	fs = require('fs-extra'),
	prompt = require('../prompt'),
	Sync = require('sync');

module.exports = function(args) {
	var pergunta = {
		question: 'Qual seu nome?'
		// format: /^teste$/i,
		// error: 'Favor informar teste!',
		// defaultValue: 'teste'
	};

	Sync(function() {
		var res = prompt.sync(null, pergunta, false);
		var res2 = prompt.sync(null, pergunta, true);
		console.log(res);
		console.log(res2);
	})
	// var appName, appPadrao;

	// doQuestions(function(res){
	// 	appName = res.appName;
	// 	appPadrao = res.appPadrao;

	// 	prepare(appName, appPadrao, function(res) {
	// 		process.stdin.destroy();
	// 		process.chdir(appName);
	// 		fs.writeJSONSync('./package.json', {
	// 			name: appName,
	// 			description: appName,
	// 			version: '1.0.0',
	// 			volo: {
	// 				baseUrl: appName + '/js/libs',
	// 				dependencies: {}
	// 			}
	// 		});
	// 	});
	// });
};

function prepare(appName, appPadrao, callback) {
	if(fs.existsSync(appName)) {
		sobreescreverDir(function(res) {
			if(res == "s") {
				createDirs(appName);
			} else {
				process.stdin.destroy();
			}
		});
	} else {
		createDirs(appName);
	}

	function createDirs(appName) {
		fs.mkdirsSync(appName + "/js/libs");
		fs.mkdirsSync(appName + "/js/collections");
		fs.mkdirsSync(appName + "/js/models");
		fs.mkdirsSync(appName + "/js/views");
		fs.mkdirsSync(appName + "/css");
		fs.mkdirsSync(appName + "/img");

		callback("Projeto criado com sucesso!");
	}
}

function sobreescreverDir(callback) {
	var pergunta = {
		question: 'O diretório informado já existe. Sobreescrever? (s/N)',
		format: /^s$|^n$|^sim$|^não$/i,
		error: 'Favor informar "S" para sim ou "N" para não!',
		defaultValue: 'n'
	};

	prompt(pergunta, function(res) {
		return callback(res);
	});
}

function doQuestions(callback) {
	var respostas = {},
		perguntas = [
		{
			question: 'Qual o nome da aplicação? (app)',
			defaultValue: 'app'
		},
		{
			question: 'Aplicação com Require e Backbone? (S/n)',
			format: /^s$|^n$|^sim$|^não$/i,
			error: 'Favor informar "S" para sim ou "N" para não!',
			defaultValue: 's'
		}
	];

	prompt(perguntas[0], function(res) {
		respostas.appName = res;
		prompt(perguntas[1], function(res) {
			respostas.appPadrao = res;
			return callback(respostas);
		});
	});
}