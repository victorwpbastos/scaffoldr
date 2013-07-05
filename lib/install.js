var exec = require('child_process').exec,
	fs = require('fs'),
	xml2js = require('xml2js'),
	_ = require('underscore'),
	bower = require('bower'),
	shell = require('shelljs');

module.exports = function(paramData) {
		parser = new xml2js.Parser(),
		that = this,
		sower = null,
		arquivo = '',
		config = JSON.parse(fs.readFileSync(__dirname + '/config.json')),
		svnDirectory = config.install.svnPath,
		svnUser = '--username ' + config.install.svnUserName + ' --password ' + config.install.svnPassword;

	deleteFolderRecursive = function(path) {
		var files = [];
		if( fs.existsSync(path) ) {
			files = fs.readdirSync(path);
			files.forEach(function(file,index){
				var curPath = path + "/" + file;
				if(fs.statSync(curPath).isDirectory()) {
					deleteFolderRecursive(curPath);
				} else {
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	};

	if(!paramData.onlySubversion) {
		bower.commands.install().on('data', function (data) {
			if (data) {
				var fetching = data.match(/bower\s\u001b.36mfetching\u001b.39m\s(.*)\n/)
				if(fetching) {
					console.log(fetching[1] + ': installing');
			  	} else {
					var installing = data.match(/bower\s\u001b.36mchecking out\u001b.39m\s(.*)\#(.*)/);
					if(installing) {
						console.log(installing[1] + ': installed on version ' + installing[2]);
					}
				}
			}
		}).on('error', function (data) {
			if (data) {
			  	console.log(data);
			}
		});
	}

	if(!paramData.onlyBower) {
		if(!shell.which('svn')) {
			console.log('Please install a svn command line client.')
			shell.exit(1);
		}

		if(!fs.existsSync('sower.json')) {
			console.log('Could not open file sower.json')
			shell.exit(1);
		}

		var sower = JSON.parse(fs.readFileSync('sower.json'));
		if(!sower.directory) {
			console.log('Could not found directory key')
			shell.exit(1);
		}
		if(!sower.dependencies) {
			console.log('Could not found dependencies key')
			shell.exit(1);
		}
	 	_.each(sower.dependencies, function(version,key){
			if(version=='latest'||version=='*') {
				var list = shell.exec('svn list ' + svnDirectory + '/' + key + ' ' + svnUser + ' --xml', {silent: true});
				if(list.code!=0) {
					console.log(list.output);
					shell.exit(1);
				}
				parser.parseString(list.output, function(err, result) {
					var versoes = new Array();
					_.each(result.lists.list[0].entry, function(value,key){
						if(value.$.kind=='dir') {
							var versao = value.name[0].match(/(.*)\.(.*)\.(.*)/);
							versoes.push([parseInt(versao[1]),parseInt(versao[2]),parseInt(versao[3]),versao[0]]);
						}
					});

					maior = _.sortBy(versoes, function(versao){return versao;});
					version = maior[maior.length - 1][3]
			 	});
			}
			var list = shell.exec('svn list ' + svnDirectory + '/' + key + '/' + version  + ' ' + svnUser + ' --xml', {silent: true});
			if(list.code!=0) {
				console.log(key + ': not found version ' + version);
				shell.exit(1);
			}

			path = sower.directory + '/' + key;
			if(fs.existsSync(path + '/.sower')) {
				var installed = JSON.parse(fs.readFileSync(path + '/.sower'));
				if (installed.version!=version) {
					if(installed.version) {
						deleteFolderRecursive(sower.directory + '/' + key);
						console.log(key + ': version changed from ' + installed.version + ' to ' + version)
					};
					console.log(key + ': installing');
					var svnExport = shell.exec('svn export '+ svnDirectory + '/' + key +  '/' + version + ' ' + sower.directory + '/' + key + ' ' + svnUser, {silent: true});
					if(svnExport.code!=0) {
						console.log(key + ': could not be installed.');
						shell.exit(1);
					} else {
						fs.writeFileSync(path + '/.sower', '{"version": "'+ version +'"}')
						console.log(key + ': installed in version ' + version)
					}
				} else {
					console.log(key + ': keep same version.')
				};
			} else {
				console.log(key + ': installing');
				var svnExport = shell.exec('svn export '+ svnDirectory + '/' + key +  '/' + version + ' ' + sower.directory + '/' + key + ' ' + svnUser, {silent: true});
				if(svnExport.code!=0) {
					console.log(key + ': could not be installed.');
					shell.exit(1);
				} else {
					fs.writeFileSync(path + '/.sower', '{"version": "'+ version +'"}');
					console.log(key + ': installed in version ' + version);
				}
			};
		});
	};
};


