var express = require('express'),
	fs = require('fs'),
	watch = require('./watch'),
	clc = require('cli-color'),
	os = require('os'),
	open = require('open');
	require('express-hijackresponse');

module.exports = function(args) {

	var app = express(),
		chrome = os.type() === 'Windows_NT' ? 'chrome' : 'google-chrome';

	function inject(req, res, next){
		var injected = false,
			state = 0,
			WEBSOCKET_CLIENT = fs.readFileSync(__dirname + '/reloader.html', 'utf8');

		res.hijack(function (err, res) {
			if (err) {
				res.unhijack(true);
				return next(err);
			}

			function injectScriptAtIndex(chunk, i) {
				if (i > 0) {
					res.write(chunk.slice(0, i));
				}
				res.write(WEBSOCKET_CLIENT);
				if (chunk.length > i) {
					res.write(chunk.slice(i));
				}
				injected = true;
			}

			if (/^text\/html/.test(res.getHeader('Content-Type'))) {

				res.removeHeader('Content-Length');
				res.writeHead(res.statusCode);

				res.on('data', function (chunk, encoding) {
					if (injected) {
						res.write(chunk, encoding);
					} else {
						for (var i = 0; i < chunk.length; i += 1) {
							var ch;
							if (Buffer.isBuffer(chunk)) {
								ch = String.fromCharCode(chunk[i]);
							} else {
								// string
								ch = chunk[i];
							}
							switch (state) {
								case 0:
								if (ch === '<') {
									state = 1;
								}
								break;
								case 1:
								// <
								if (ch === '/') {
									state = 2;
								} else {
									state = 0;
								}
								break;
								case 2:
								// </
								if (ch === 'h' || ch === 'H') {
									state = 3;
								} else {
									state = 0;
								}
								break;
								case 3:
								// </h
								if (ch === 'e' || ch === 'E') {
									state = 4;
								} else if (ch === 't' || ch === 'T') {
									state = 7;
								} else {
									state = 0;
								}
								break;
								case 4:
								// </he
								if (ch === 'a' || ch === 'A') {
									state = 5;
								} else {
									state = 0;
								}
								break;
								case 5:
								// </hea
								if (ch === 'd' || ch === 'D') {
									state = 6;
								} else {
									state = 0;
								}
								break;
								case 6:
								// </head
								if (ch === '>' || ch === ' ') {
									injectScriptAtIndex(chunk, i + 1 - '</head>'.length);
									return;
								} else {
									state = 0;
								}
								break;
								case 7:
								// </ht
								if (ch === 'm' || ch === 'M') {
									state = 8;
								} else {
									state = 0;
								}
								break;
								case 8:
								// </htm
								if (ch === 'l' || ch === 'L') {
									state = 9;
								} else {
									state = 0;
								}
								break;
								case 9:
								// </html
								if (ch === '>' || ch === ' ') {
									injectScriptAtIndex(chunk, i + 1 - '</html>'.length);
									return;
								} else {
									state = 0;
								}
								break;
							}
						}
						if (!injected) {
							res.write(chunk, encoding);
						}
					}
				});

				res.on('end', function () {
					if (!injected) {
						injectScriptAtIndex(new Buffer([]), 0);
					}
					res.end();
				});
			} else {
				res.unhijack(true);
			}
		});

		next();
	}

	if(args === "watch") {
		app.use(inject);
	}

	app.use(express.static(process.cwd()));
	app.listen(3000);

	console.log(clc.cyan.bold('Server running on http://localhost:3000...'));

	if(args === "watch") {
		watch();
	}

	open('http://localhost:3000', chrome);
}