var	collection = require("./collection"),
	model = require("./model"),
	view = require("./view");

module.exports = {
	exposed: ["collection", "c", "model", "m", "view", "v"],
	collection: {
		description: "Cria uma Backbone.Collection",
		example: "[generate|g] collection <collectionName>",
		run: collection
	},
	c: {
		description: "Alias para collection",
		example: "[generate|g] c <collectionName>",
		run: collection
	},
	model: {
		description: "Cria um Backbone.Model",
		example: "[generate|g] model <modelName>",
		run: model
	},
	m: {
		description: "Alias para model",
		example: "[generate|g] m <modelName>",
		run: model
	},
	view: {
		description: "Cria uma Backbone.View",
		example: "[generate|g] view <viewName>",
		run: view
	},
	v: {
		description: "Alias para view",
		example: "[generate|g] v <viewName>",
		run: view
	}
}