// __________________________________________________________________________________________________________________________________________________________________
// 	ACCOUNT API INDEX

//	Responsible for all account functionality includeing account creation, deletion, authentication and maintinace
//___________________________________________________________________________________________________________________________________________________________________
//	AUTHENTICATION 

//	### 	- register userAccount 			responsible for handling the creation of a new user
//	###	- logInUserAccount				responsible for logging in a user using the assigned password
//	###	- logOutUser					responsible for logging the user out, invalidinting the token and clearing cookies
//___________________________________________________________________________________________________________________________________________________________________
// 	PROTECTED INFOMATION REQUESTS

// 	###	- getUserAccounts				responsible for retriveing all user accounts within the system
//___________________________________________________________________________________________________________________________________________________________________
//	UNPROTECTED INFORMATION REQUESTS 

//	###	- isUsernameRegistered			responsible for checking if a username is registered within the system presently
// 	###	- isEmailAddressRegistered		responsible for checking if a email address is registed within the system presently 
//___________________________________________________________________________________________________________________________________________________________________
// 	PASSWORD MANAGEMENT AND RECOVERY 

// 	###	- changePassword 				responsible for changeing a spesified users password after re-authenticating the user
// 	###	- createRecoveryKeyForAccount	responsible for createing a random recovery key for a spesified user, this key is sent to the user via the registered email address
//	###	- recoverAccountWithRecoveryKey	responsible for changeing a users password useing the supplied recovery key, this key is checked to ensure validity
//___________________________________________________________________________________________________________________________________________________________________
// 	UPDATE STORED USER INFOMATION

// 	###	- updateAccountDetails 			responsible for changeing the stored information relating to the user appart from passwords and non changable infomation such as username
//___________________________________________________________________________________________________________________________________________________________________
//	ACCOUNT DELETION - please dont :'(	
	
//	###	- deleteAccount					responsible for removal of the specified user account after re-autheticating the user
//___________________________________________________________________________________________________________________________________________________________________



var userModel = require('../model/UserModel.js');
var qs = require('querystring');
var fs = require('fs');
var tokenModel = require('../model/TokenModel.js');
var cookie = require('cookie');

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

		var error = [];

		console.log(data);

		if (!data.username)
			error.push('No username specified');

		if (!data.password)
			error.push('No password specified');

		else if (data.password.length < 8)
			error.push('Password length must be atleast 8 characters');

		if (!data.email)
			error.push('No email address specified');

		if (!data.firstName)
			error.push('No first name specified');

		if (!data.surname)
			error.push('No surname specified');

		if (!data.middleName)
			data.middleName = '';

		// Checks to see if the error array
		if (error.length) {

			res.statusCode = 400;
			res.end(JSON.stringify({
				status : 'error',
				error : error
			}));
			
			return;

		}

		// Adds a new user to the system
		userModel.createNewUser(data.username, data.password, data.email, data.firstName, data.middleName, data.surname, function(err) {

			if (err != null) {

				if (err.code === 11000) {
					
					res.statusCode = 400;
					res.end(JSON.stringify({
						status : 'error',
						error : 'Email address already registered'
					}));
					
					return;		

				} else {

					res.statusCode = 400;
					res.end(JSON.stringify({
						status : 'error',
						error : err.err
					}));
					
					return;		
				}

			} else {

				tokenModel.createToken(data.emailAddress, function(err, token) {

					if (err != null) {

						res.statusCode = 400;
						res.end(JSON.stringify({
							status : 'error',
							error : 'Could not genrate token'
						}));
						
						return;
						
					} else {
						
						res.cookie('authenticationCookie', JSON.stringify(token), {
							maxAge : 900000,
							httpOnly : true
						});

						res.statusCode = 200
						res.end (JSON.stringify({
							status : 'sucsess'
							
						}));
						
						return;
								
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
			res.contentType = 'application/json';
			res.end(JSON.stringify({
				status : 'error',
				error : 'No username specified'
			}));
			
			return;

		}

		if (!data.password) {
			res.statusCode = 400;
			res.end(JSON.stringify({
				status : 'error',
				error : 'No password specified'
			}));
			
			return;

		}

		userModel.loginUsingPassword(data.username, data.password, function(
				err, accountData) {

			if (err != null) {
				res.statusCode = 400;
				res.contentType = 'application/json';
				res.end(JSON.stringify({
					status : 'error',
					error : 'Invalid login details'
				}));
				
				return;

			} else {

				tokenModel.createToken(accountData.emailAddress, function(err, token) {

					if (err != null) {
						res.statusCode = 500;
						res.contentType = 'application/json';
						res.end(JSON.stringify({
							status : 'error',
							error : 'Internal error'
						}));
						
						return;
						
					} else {

						var userDetails = new Object;

						userDetails.firstName = accountData.firstName;
						userDetails.middleName = accountData.middleName;
						userDetails.surname = accountData.surname;
						userDetails.emailAddress = accountData.emailAddress;
						userDetails.username = accountData.username;
						
						res.cookie('authenticationCookie', JSON.stringify(token), {
							maxAge : 900000,
							httpOnly : true
						});
						
						res.cookie('userInfoCookie', JSON.stringify(userDetails), {
							maxAge : 900000,
							httpOnly : false
						});

						res.writeHead(200);
						res.contentType = 'application/json';
						res.end(JSON.stringify({
							status : 'sucsess'
						}));
						
						return;
						
					}
				});
			}
		});
	});
}

function logOutUser(req, res) {

	if (req.headers.cookie != undefined) {
		
		var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));

		tokenModel.invalidateToken(token);
	}
	
	res.statusCode = 200;
	res.clearCookie('authenticationCookie');
	res.clearCookie('userInfoCookie');
	res.contentType = 'application/json';
	res.end(JSON.strigify({
		status : 'sucsess'
	}));
	
	return;
}

function getAllAccounts(req, res) {

	if (req.headers.cookie != undefined) {

		var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));
			
		tokenModel.verifyToken(token, function(validToken) {
	
			if (validToken) {
				
				userModel.getAllUsers(function(err, userAccounts) {
					
					console.log(userAccounts);
					res.statusCode = 200;
					res.contentType = 'application/json';
					res.end(JSON.stringify({
						status : 'sucess',
						userAccounts : userAccounts
					}));
					
					return;
				});
				
			} else {
				
				res.statusCode = 403;
				res.contentType = 'application/json';
				res.end(JSON.stringify({
					status : 'error',
					error : 'Invalid cridentials'
				}));
				
				return;
				
			}
		});
	
	} else {
		
		res.statusCode = 403;
		res.contentType = 'application/json';
		res.end(JSON.stringify({
			status : 'error',
			error : 'No cridentials provided'
		}));
		
		return;
		
	}
}

function isUsernameRegistered (req, res) {

		userModel.doseUserExsist(req.query.username, function(err, exsists) {

		res.statusCode = 200;
		res.contentType = 'application/json';
		res.end(JSON.stringify({
			status : 'sucsess',
			result : exsists
		}));
		
		return;
	});

}

function isEmailAddressRegistered (req, res) {

		userModel.isEmailAddressRegisterd(req.query.username, function(err, exsists) {

		res.statusCode = 200;
		res.contentType = 'application/json';
		res.end(JSON.stringify({
			status : 'sucsess',
			result : exsists
		}));
		
		return;
	});
}

function changePassword(req, res) {

	if (req.headers.cookie != undefined) {

		var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));

		tokenModel.verifyToken(token, function(validToken) {

			if (validToken) {

				userModel.setNewPassword(token.emailAddress, req.query.oldPassword, req.query.newPassword, function(err) {
					
					if (!err) {
						
						res.statusCode = 500;
						res.contentType = 'application/json';
						res.end(JSON.stringify({
							status : 'error',
							error : 'internal error'
						}));
						
						return;
						
					} else {

						res.statusCode = 200;
						res.contentType = 'application/json';
						res.end(JSON.stringify({
							status : 'sucsess'
						}));
						
						return;
					}
				});
				
			} else {
				
				res.statusCode = 403;
				res.contentType = 'application/json';
				res.end(JSON.stringify({
					status : 'error',
					error : 'Invalid cridentials'
				}));
				
				return;

			}
		});

	} else {
		
		res.statusCode = 403;
		res.contentType = 'application/json';
		res.end(JSON.stringify({
			status : 'error',
			error : 'Invalid cridentials'
		}));
		
		return;
	}
}

function createRecoveryKeyForAccount (req, res){
	console.log(req.query.emailAddress);
	userModel.isEmailAddressRegisterd (req.query.emailAddress, function (err, exsists ){		
		if (err != null){
			
			res.statusCode = 500;
			res.contentType = 'application/json';
			res.end(JSON.stringify({
				status : 'error',
				error : 'internal error'
			}));
			
			return;
			
		} else if (exsists)  {
			
			userModel.createRecoveryKey(req.query.emailAddress, function(err) {
							
				if (err){
								
					res.statusCode = 500;
					res.contentType = 'application/json';
					res.end(JSON.stringify({
						status : 'error',
						error : 'internal error'
					}));
					
					return;

				}else {
								
					res.statusCode = 201;
					res.contentType = 'application/json';
					res.end(JSON.stringify({
						status : 'sucsess'
					}));
					
					return;
				}
			});
			
		} else {
			
			res.statusCode = 400;
			res.contentType = 'application/json';
			res.end(JSON.stringify({
				status : 'error',
				error : 'Account not found'
			}));
			
			return;
		}
	});
}

function recoverAccountWithRecoveryKey (req, res){
	
	var body = '';

	req.on('data', function(data) {
		
		body += data;

		if (body.length > 1e6) {

			req.connection.destroy();
		}
	});

		req.on('end', function() {
			
			var data = qs.parse(body);
			
			userModel.changePasswordViaRecoveryKey(data.password, data.recoveryKey, data.emailAddress, function(err){
			
			if (err != null){
				
				// 500 error if invalid?
				res.statusCode = 500;
				res.contentType = 'application/json';
				res.end(JSON.stringify({
					status : 'error',
					error :  'Account not found with that recovery key'
				 }));
				
				return;
				
			}else {
				
				res.statusCode = 200;
				res.contentType = 'application/json';
				res.end(JSON.stringify({
					status : 'sucsess'
				}));
				
				return;
			}
		});
	});
}

function updateAccountDetails(req, res){

	var body = '';

	req.on('data', function(data) {
		body += data;

		if (body.length > 1e6) {

			req.connection.destroy();
		}
	});

	req.on('end', function() {

		if (req.headers.cookie != undefined) {

			var data = qs.parse(body);

			var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));

			tokenModel.verifyToken(token,function(validToken) {

				if (validToken) {
					
					userModel.updateUserInfomation(token.emailAddress,data.firstName,data.middleName,data.surname,data.profileInfomation, function(err) {

						if (err != null) {

							res.statusCode = 500;
							res.contentType = 'application/json';
							res.end(JSON.stringify({
								status : 'error',
								error : 'internal error'
							}));
							
							return;

						} else {

							res.statusCode = 200;
							res.contentType = 'application/json';
							res.end(JSON.stringify({
								status : 'sucess'
							}));
							
							return;
						}
					});

				} else {

					res.statusCode = 401;
					res.contentType = 'application/json';
					res.end(JSON.stringify({
						status : 'error',
						error : 'invalid cridentials'
					}));
					
					return;
				}
			});

		} else {
			
			res.statusCode = 401;
			res.contentType = 'application/json';
			res.end(JSON.stringify({
				status : 'error',
				error : 'invalid cridentials'
			}));
			
			return;
		}
	});
}

function deleteAccount (req, res){
	
	if (req.headers.cookie != undefined) {

		var token = (JSON.parse(cookie.parse(req.headers.cookie)['authenticationCookie']));
		
		tokenModel.verifyToken = (token, function (validToken){
			
			if (validToken){
				userModel.removeAccount(token.emailAddress, function (err){
					
					if (err){
						res.statusCode = 500;
						res.contentType = 'application/json';
						res.end(JSON.stringify({
							status : 'error',
							error : 'internal error'
						}));
						
						return;
						
					}else {
						
						res.statusCode = 200;
						res.contentType = 'application/json';
						res.end(JSON.stringify({
							status : 'sucsess',
						}));
						
						return;
					}
				});
				
			}else {
				
				res.statusCode = 401;
				res.contentType = 'application/json';
				res.end(JSON.stringify({
					status : 'error',
					error : 'invalid cridentials'
				}));
				
				return;
			}
		});		
	}	
}

exports.deleteAccount = deleteAccount;
exports.createRecoveryKeyForAccount = createRecoveryKeyForAccount;
exports.recoverAccountWithRecoveryKey = recoverAccountWithRecoveryKey;
exports.updateAccountDetails = updateAccountDetails;
exports.getAllAccounts = getAllAccounts;
exports.registerUserAccount = registerUserAccount;
exports.logInUserAccount = logInUserAccount;
exports.logOutUser = logOutUser;
exports.isUsernameRegistered = isUsernameRegistered;
exports.changePassword = changePassword;
