var userModel = require("../model/UserModel.js");
function registerUserAccount(req, res, next) {

	console.log(req.param);
	var errors = [];

	if (!req.param.username)
		errors.push("No username specified");

	if (!req.param.password)
		errors.push("No password specified");

	else if (req.param.password.length < 8)
		errors.push("Password length must be atleast 8 characters");

	if (!req.param.email)
		errors.push("No email address specified");

	if (!req.param.firstName)
		errors.push("No first name specified");

	if (!req.param.surname)
		errors.push("No surname specified");

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
	userModel.createNewUser(req.param.username, req.param.password,
			req.param.emailAddress, req.param.firstName, req.param.middleName,
			req.param.surname, function(err) {
			
			if (err){
				
				if (err.code === 11000) {
					res.statusCode = 400;
					res.end(JSON.stringify({
						status : "error",
						errors : "Email address already registered"
					}));
				return;
				
				}else{
					
					res.statusCode = 400;
					res.end(JSON.stringify({
						status : "error",
						errors : err.err
					}));
					return;
				}
			}
	});
	
}

function loginUserAccount(req, res) {

	console.log(req);
	if (!req.param.username) {
		res.statusCode = 400;
		res.end(JSON.stringify({
			status : "error",
			errors : "No username specified"
		}));
		return;

	}

	if (!req.param.password) {
		res.statusCode = 400;
		res.end(JSON.stringify({
			status : "error",
			errors : "No password specified"
		}));
		return;

	}
	
	userModel.loginUsingPassword(req.param.username, req.param.password, function(err){
		res.end(JSON.stringify({
			status : "error",
			errors : err.err
		}));
		return;
	});

}

function logOutUser(req, res){
	
}

exports.registerUserAccount = registerUserAccount;
exports.loginUserAccount = loginUserAccount;
		