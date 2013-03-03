module.exports = {
	exposed: ["collection", "c", "model", "m", "view", "v"],
	collection: {
		description: "Cria uma Backbone.Collection",
		example: "[generate|g] collection <collectionName>",
		run: function() {
			console.log("iniciando a app");
		}
	},
	c: {
		description: "Alias para collection",
		example: "[generate|g] c <collectionName>",
		run: function() {
			console.log("iniciando a app");
		}
	},
	model: {
		description: "Cria um Backbone.Model",
		example: "[generate|g] model <modelName>",
		run: function() {
			console.log("build da app");
		}
	},
	m: {
		description: "Alias para model",
		example: "[generate|g] m <modelName>",
		run: function() {
			console.log("iniciando a app");
		}
	},
	view: {
		description: "Cria uma Backbone.View",
		example: "[generate|g] view <viewName>",
		run: function() {
			console.log("removendo arquivos");
		}
	},
	v: {
		description: "Alias para view",
		example: "[generate|g] v <viewName>",
		run: function() {
			console.log("iniciando a app");
		}
	},
}