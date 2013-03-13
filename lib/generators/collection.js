var clc = require('cli-color'),
    fs = require('fs-extra');

module.exports = function(collectionName) {
    var template = [
        "define(function(require) {",
        "    var Backbone = require('backbone');",
        "",
        "    var " + collectionName + " = Backbone.Collection.extend({",
        "        model: ''",
        "    });",
        "    return " + collectionName + ";",
        "});"
    ].join("\n");

    if(!fs.existsSync(".bowerrc")) {
        console.log(clc.red.bold("\nFavor executar o comando na raiz do projeto!\n"));
        return;
    } else {
        fs.outputFile("app/js/collections/" + collectionName + ".js", template, function() {
            console.log(clc.cyanBright.bold("Collection " + collectionName + " criada com sucesso!\n"));
        });
    }
}