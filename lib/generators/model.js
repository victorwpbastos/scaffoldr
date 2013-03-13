var clc = require('cli-color'),
    fs = require('fs-extra');

module.exports = function(modelName) {
    var template = [
        "define(function(require) {",
        "    var Backbone = require('backbone');",
        "",
        "    var " + modelName + " = Backbone.Model.extend({",
        "",
        "    });",
        "    return " + modelName + ";",
        "});"
    ].join("\n");

    if(!fs.existsSync(".bowerrc")) {
        console.log(clc.red.bold("\nFavor executar o comando na raiz do projeto!\n"));
        return;
    } else {
        fs.outputFile("app/js/models/" + modelName + ".js", template, function() {
            console.log(clc.cyanBright.bold("Model " + modelName + " criado com sucesso!\n"));
        });

    }
}