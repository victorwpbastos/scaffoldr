var clc = require('cli-color'),
    fs = require('fs-extra');

module.exports = function(viewName) {
    var template = [
        "define(function(require) {",
        "    var Backbone = require('backbone');",
        "",
        "    var " + viewName + " = Backbone.View.extend({",
        "",
        "    });",
        "    return " + viewName + ";",
        "});"
    ].join("\n");

    if(!fs.existsSync(".bowerrc")) {
        console.log(clc.red.bold("\nFavor executar o comando na raiz do projeto!\n"));
        return;
    } else {
        fs.outputFile("app/js/views/" + viewName + ".js", template, function() {
            console.log(clc.cyanBright.bold("View " + viewName + " criada com sucesso!\n"));
        });
    }
}