var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    handlebars = require('handlebars');

module.exports = {

    precompile: function(folder) {
        var templates = [],
            isFolder,
            isPartial,
            fileExt,
            output = [],
            data;

        var getPaths = function(_path) {
            isFolder = fs.statSync(_path).isDirectory();
            if(isFolder) {
                fs.readdirSync(_path).forEach(function(_file) {
                    getPaths(_path + '/' + _file);
                });
            } else {
                fileExt = path.extname(_path).replace('.','');
                if(fileExt == 'tpl') {
                    templates.push(_path);
                }
            }
        };

        output.push('(function() {\n  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n');

        fs.readdirSync(folder).forEach(function(filePath) {
            if(folder !== '.') {
                getPaths(folder + '/' + filePath);
            } else {
                getPaths(filePath);
            }
        });

        templates.forEach(function(template) {
            isPartial = _.last(template.split(path.sep)).charAt(0) == '_' ? true : false;
            data = fs.readFileSync(template, 'utf8');

            if(isPartial) {
                output.push('Handlebars.partials[\'' + template + '\'] = template(' + handlebars.precompile(data) + ');\n');
            } else {
                output.push('templates[\'' + template + '\'] = template(' + handlebars.precompile(data) + ');\n');
            }
        });

        output.push('})();');
        output = output.join('');
        fs.writeFileSync('templates.js', output, 'utf8');
    }
}