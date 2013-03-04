module.exports = {
	exposed: ["collection", "c", "model", "m", "view", "v"],
	collection: {
		description: "Cria uma Backbone.Collection",
		example: "[generate|g] collection <collectionName>",
		run: function() {
			console.log("criando collection");
		}
	},
	c: {
		description: "Alias para collection",
		example: "[generate|g] c <collectionName>",
		run: function() {
			module.exports.collection.run();
		}
	},
	model: {
		description: "Cria um Backbone.Model",
		example: "[generate|g] model <modelName>",
		run: function() {
			console.log("criando o model");
		}
	},
	m: {
		description: "Alias para model",
		example: "[generate|g] m <modelName>",
		run: function() {
			module.exports.model.run();
		}
	},
	view: {
		description: "Cria uma Backbone.View",
		example: "[generate|g] view <viewName>",
		run: function() {
			console.log("criando a view");
		}
	},
	v: {
		description: "Alias para view",
		example: "[generate|g] v <viewName>",
		run: function() {
			module.exports.view.run();
		}
	},
}