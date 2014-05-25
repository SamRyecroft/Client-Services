var userModel = require("../model/UserModel.js");
var qs = require('querystring');
var fs = require('fs');
var tokenModel = require('../model/TokenModel.js');
var cookie = require("cookie"); 

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
					} else {

						tokenModel.createToken(data.emailAddress, function(err,
								token) {

							if (err != null) {
								res.statusCode = 400;
								res.end(JSON.stringify({
									status : "error",
									errors : "Could not genrate token"
								}));

							} else {
								res.cookie('authenticationCookie', JSON
										.stringify(token), {
									maxAge : 900000,
									httpOnly : true
								});
								res.writeHead(302, {
									'Location' : '/#/welcome'
								// add other headers here...
								});
								res.end();
							}

						});

					}
				});
	});
}

function logInUserAccount(req, res) {

	var body = '';

	req.on('data', function(data) {
		body += data;

		if (body.length > 1e6) {

			req.connection.destroy();
		}
	});

	req.on('end', function() {

		var data = qs.parse(body);

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
				res.statusCode = 400;
				res.end(JSON.stringify({
					status : "error",
					errors : err.err
				}));

				return;

			} else {

				tokenModel.createToken(accountData.emailAddress, function(err,
						token) {

					if (err != null) {
						res.statusCode = 400;
						res.end(JSON.stringify({
							status : "error",
							errors : "Could not genrate token"
						}));

					} else {
						res.cookie('authenticationCookie', JSON
								.stringify(token), {
							maxAge : 900000,
							httpOnly : true
						});
						res.writeHead(302, {
							'Location' : '/#/welcome'
						// add other headers here...
						});
						res.end();
					}

				});
			}

		});
	});

}

function logOutUser(req, res) {

	var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));

	tokenModel.invalidateToken(token);

	res.statusCode = 200;
	res.end("user logged out");

}

function getAllAccounts(req, res) {

	var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));

	tokenModel.verifyToken(token, function (validToken){
		
		if (validToken){
			userModel.getAllUsers(function(err, userAccounts) {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.end(JSON.stringify(userAccounts));
			});
		}else {
			res.statusCode = 400;
			res.end("invalid cridentials");
		}
		
	}); 
		
	
		
	
}

exports.getAllAccounts = getAllAccounts;
exports.registerUserAccount = registerUserAccount;
exports.logInUserAccount = logInUserAccount;
exports.logOutUser = logOutUser;
