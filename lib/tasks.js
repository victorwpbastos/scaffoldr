module.exports = {
	exposed: ["init", "build", "b", "generate", "g"],
	init: {
		description: "Cria a estrutura para uma nova aplicação web",
		example: "init",
		run: function() {
			console.log("iniciando a app");
		}
	},
	generate: {
		description: "Gerador de arquivos [collections, models, views]",
		example: "generate <gerador> <nome>",
		run: function() {
			console.log("gerando arquivos");
		}
	},
	g: {
		description: "Alias para generate",
		example: "g <gerador> <nome>",
		run: function() {
			module.exports.generate.run();
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