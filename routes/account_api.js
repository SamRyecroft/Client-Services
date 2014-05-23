var userModel = require("../model/UserModel.js");
var qs = require('querystring');

function registerUserAccount(req, res, next) {

	var body = '';

	req.on('data', function(data) {
		body += data;

		if (body.length > 1e6) {

			req.connection.destroy();
		}
	});

	req.on('end', function() {

		var data = qs.parse(body);

		console.log(data);
		var errors = [];

		if (!data.username)
			errors.push("No username specified");

		if (!data.password)
			errors.push("No password specified");

		else if (data.password.length < 8)
			errors.push("Password length must be atleast 8 characters");

		if (!data.email)
			errors.push("No email address specified");

		if (!data.firstName)
			errors.push("No first name specified");

		if (!data.surname)
			errors.push("No surname specified");

		if (!data.middleName)
			data.middleName = "";

		// Checks to see if the errors array
		if (errors.length) {

			res.statusCode = 400;
			res.end(JSON.stringify({
				status : "error",
				errors : errors
			}));
			return;

		}

		// Adds a new user to the system
		userModel.createNewUser(data.username, data.password, data.email,
				data.firstName, data.middleName, data.surname, function(err) {

					if (err != null) {

						if (err.code === 11000) {
							res.statusCode = 400;
							res.end(JSON.stringify({
								status : "error",
								errors : "Email address already registered"
							}));
							return;

						} else {

							res.statusCode = 400;
							res.end(JSON.stringify({
								status : "error",
								errors : err.err
							}));
							return;
						}
					}else  {
						
						res.statusCode = 400;
						res.end(JSON.stringify({
							status : "User added",
							compleated : "User added"
						}));
						return;
					}
				});
			});
}

function loginUserAccount(req, res) {

	var body = '';

	req.on('data', function(data) {
		body += data;

		if (body.length > 1e6) {

			req.connection.destroy();
		}
	});

	req.on('end', function() {

		var data = qs.parse(body);

		console.log(data);
		if (!data.username) {
			res.statusCode = 400;
			res.end(JSON.stringify({
				status : "error",
				errors : "No username specified"
			}));
			return;

		}

		if (!data.password) {
			res.statusCode = 400;
			res.end(JSON.stringify({
				status : "error",
				errors : "No password specified"
			}));
			return;

		}

		userModel.loginUsingPassword(data.username, data.password, function(
				err, accountData) {

			if (err != null) {
				res.end(JSON.stringify({
					status : "error",
					errors : err.err
				}));
				return;
			} else {
				res.statusCode = 400;
				res.end(JSON.stringify(accountData));
			}

		});
	});

}

function logOutUser(req, res) {

}

exports.registerUserAccount = registerUserAccount;
exports.loginUserAccount = loginUserAccount;
