clc = require('cli-color');

module.exports = function(args) {
	doQuestions(function(res){
		prepare(res);
	});

	function prepare(res) {
		console.log(res);
	}

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
	]

	prompt(perguntas[0], function(res) {
		respostas.appName = res;
		prompt(perguntas[1], function(res) {
			respostas.appPadrao = res;
			process.stdin.destroy();
			return callback(respostas);
		});
	});
}

function prompt(obj, callback) {
	var question = obj.question,
		format = obj.format || null,
		error = obj.error || null,
		defaultValue = obj.defaultValue,
		stdin = process.stdin,
		stdout = process.stdout;

	stdin.resume();
	stdout.write("" + clc.cyanBright(question) + ": ");
	return stdin.once('data', function(data) {
		data = data.toString().trim();
		if(format && data !== "") {
			if (format.test(data)) {
				return callback(data);
			} else {
				stdout.write("\n" + clc.red.bold(error) + "\n\n");
				return prompt(obj, callback);
			}
		} else if (!format && data !== "") {
			return callback(data);
		}
		return callback(defaultValue);
	});
}