var init = require("./init"),
	install = require("./install"),
	generators = require("../generators/generators"),
	utils = require("../utils"),
	clc = require('cli-color'),
	_ = require("underscore");

module.exports = {
	exposed: ["init", "install", "build", "b", "generate", "g"],
	install: {
		description: "Instala pacotes",
		example: "install <nome-do-pacote>",
		run: install
	},
	init: {
		description: "Cria a estrutura para uma nova aplicação web",
		example: "init",
		run: init
	},
	generate: {
		description: "Gerador de arquivos [collections, models, views]",
		example: "generate <gerador> <nome>",
		run: function(args) {
			var metodo = args[0],
				param = args[1];

			var exists = _.contains(generators.exposed, metodo);
			if(exists) {
				generators[metodo].run(param);
			} else {
				console.log(clc.red.bold("Gerador não disponível! Tente algum dos geradores abaixo:"));
				console.log(generators.exposed)
			}
		}
	},
	g: {
		description: "Alias para generate",
		example: "g <gerador> <nome>",
		run: function(args) {
			module.exports.generate.run(args);
		}
	},
	build: {
		description: "Prepara a aplicação para ser colocada em produção",
		example: "build",
		run: function() {
			console.log("build da app");
		}
	},
	b: {
		description: "Alias para build",
		example: "b",
		run: function() {
			module.exports.build.run();
		}
	},
	clean: {
		description: "Remove os arquivos desnecessários",
		run: function() {
			console.log("removendo arquivos");
		}
	}
};