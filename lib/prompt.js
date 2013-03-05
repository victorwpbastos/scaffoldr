var clc = require('cli-color');

module.exports = function(obj, callback){
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
				return callback(data);
			} else {
				stdout.write("\n" + clc.red.bold(error) + "\n\n");
				return module.exports(obj, callback);
			}
		} else if (!format && data !== "") {
			return callback(data);
		}
		return callback(defaultValue);
	});
};