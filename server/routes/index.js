var fs = require('fs');
var app = require('../app.js').app;

app.get('/', function(req, res) {

	if (req.headers.cookie === undefined) {

		res.writeHead(302, {
			'Location' : '/loginPage.html'

		});
		res.end();

	} else {
			res.writeHead(302, {
				'Location' : '/welcomePage.html'

			});
			res.end();
	}
});

