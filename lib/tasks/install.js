var spawn = require('child_process').spawn,
    fs = require('fs-extra'),
    _ = require('underscore'),
    clc = require('cli-color');

module.exports = function(args) {
    pacotes = args;

    if(!fs.existsSync(".bowerrc")) {
        console.log(clc.red.bold("\nFavor executar o comando na raiz do projeto!\n"));
        return;
    } else {
        _.each(pacotes, function(pacote, index, list) {

            var bower = spawn('bower', ['install', pacote]);

            bower.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            bower.stderr.on('data', function (data) {
                console.log(data);
            });

            bower.on('exit', function (code) {
                if(code === 0) {
                    console.log(clc.cyanBright.bold("\n" + pacote + " instalado com sucesso!\n"));
                }
            });
        });
    }
}