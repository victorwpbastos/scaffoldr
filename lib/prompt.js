var clc = require('cli-color');

module.exports = function(obj, last, callback){
	var question = obj.question,
		format = obj.format || null,
		error = obj.error || null,
		defaultValue = obj.defaultValue,
		stdin = process.stdin,
		stdout = process.stdout;

	stdin.resume();
	stdout.write("" + clc.cyanBright(question) + ": ");
	return stdin.once('data', function(data) {
		data = data.toString().trim();
		if(format && data !== "") {
			if (format.test(data)) {
				if(last) {
					process.stdin.destroy();
				}
				return callback(null, data);
			} else {
				stdout.write("\n" + clc.red.bold(error) + "\n\n");
				return module.exports(obj, last, callback);
			}
		} else if (!format && data !== "") {
			if(last) {
				process.stdin.destroy();
			}
			return callback(null, data);
		}
		if(last) {
			process.stdin.destroy();
		}
		return callback(null, defaultValue);
	});
};