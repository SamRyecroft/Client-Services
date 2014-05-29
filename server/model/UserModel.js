var mongoDB = require('mongoose');
var userId = mongoDB.Schema.ObjectId;
var crypto = require('crypto');
var Schema = mongoDB.Schema;
var uuid = require('node-uuid');
var MAXIMUM_FAILED_LOGIN_ATTEMPTS = require('../config.js').MAXIMUM_FAILED_LOGIN_ATTEMPTS;
var LOCK_OUT_TIME = require('../config.js').LOCKOUT_TIME;
var userSchema = mongoDB
		.Schema({

			username : {
				type : String,
				required : true
			},
			emailAddress : {
				type : String,
				required : true,
				index : {
					unique : true
				},
				validate : /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
			},

			// Authentication
			password : {
				type : String,
				required : true
			},
			salt : {
				type : String,
				required : false,
				"default" : uuid.v1
			},
			numberOfFaildLoginAttempts : {
				type : Number,
				required : true,
				"default" : 0
			},
			accountLockedUntill : {
				type : Date,
				required : false,
				defult : new Date
				
			},

			// User information
			firstName : {
				type : String,
				required : false
			},
			middleName : {
				type : String,
				required : false
			},
			surname : {
				type : String,
				required : false
			},

		});

// Password cryptography functions
var saltValue = generateSalt();

// Creates a random 20 character salt value from the character set
function generateSalt() {

	var CHARACTERSET = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var saltValue = '';

	do {

		var characterSetIndex = Math
				.floor((Math.random() * CHARACTERSET.length));
		saltValue += CHARACTERSET.charAt(characterSetIndex);

	} while (saltValue.length != 20);

	return saltValue;

}

// Creates the sha512 hash value for the password combined with the salt
function createHash(password, saltValue) {

	return crypto.createHmac('sha512', (saltValue + password)).digest('hex');

}


// Creates a hash value of a password with a specified salt against a already
// hashed password
function isValidPassword(password, hashedPassword, saltValue) {

	return hashedPassword === createHash(password, saltValue);

};

var userModel = mongoDB.model('User', userSchema);

// Validates user credentials against the stored values before returning the
// user data if the credentials are correct
function loginUsingPassword(accountIdentifier, password, callback) {

	userModel.findOne({
		$or : [ {
			username : accountIdentifier
		}, {
			email : accountIdentifier
		} ]
	}, function(err, userAccount) {

		if (err || (userAccount == null)) {

			// Returns an error if no user account was found with the specified
			// username or email address
			return callback(new Error('The user was not found :('));

		}

		if (!(userAccount.accountLockedUntill > new Date)) {
			// Uses the isValidPassword method to check if the password entered
			// matches the one on record
			if (isValidPassword(password, userAccount.password,
					userAccount.salt)) {

				userAccount.numberOfFaildLoginAttempts = 0;
				
				userAccount.save();
				
				// RUN IF PASSWORD IS CORRECT

				// Returns the data retrived from the database
				return callback(null, userAccount);
				
			} else {
				
				userAccount.numberOfFaildLoginAttempts += 1;
				
				if (userAccount.numberOfFaildLoginAttempts > MAXIMUM_FAILED_LOGIN_ATTEMPTS){
					
					console.log();
					console.log("account lock code run");
					userAccount.accountLockedUntill = ((new Date).setHours((new Date).getHours() + LOCK_OUT_TIME));
				}
				
				userAccount.save();
				// RUN IF PASSWORD IS INCORRECT
				return callback(new Error('invalid password'));

			}
		}else {
			
			return callback(new Error ('This account is locked untill ' + userAccount.numberOfFailedLoginAttempts));
		}
	});
}

// Creates a new user account adding it to the database
function createNewUser(username, password, emailAddress, firstName, middleName,
		surname, callback) {

	var userAccount = new userModel({
		username : username,
		password : createHash(password, saltValue),
		salt : saltValue,
		emailAddress : emailAddress,
		firstName : firstName,
		middleName : middleName,
		surname : surname
	});

	userAccount.save(function(err, userAccount) {

		if (err) {
			console.error(err);
			callback(new Error("Duplicate user :("));

		} else {

			callback(null);
		}

	});
}

// Checks to see if a user account with the specified username exsists
function doseUserExsist(username, callback) {

	userModel.find({
		username : username
	}, null, function(err, results) {

		if (results.length === 1) {

			callback(true);

		} else {

			callback(false);
		}

	});
}

// Checks to see if an account with the specified email address exsists
function isEmailAddressRegisterd (emailAddress, callback){
	
	userModel.find({
		emailAddress : emailAddress
	}, null, function (err, results){
		
		if (result.length === 1){
			
			callback(true);
		
		}else {
			
			callback(false);
			
		}
	});
}

// Sets a new password for a user account when provided with the correct emailAddress and correct origanl password
function setNewPassword(emailAddress, oldPassword, newPassword, callback){

	userModel.find({
		emailAddress : emailAddress
	}, null, function (err, userAccount){
		
		if (isValidPassword(oldPassword, userAccount.password, userAccount.salt)){
			
			userAccount.password = newPassword;
			userAccount.salt = saltValue;
			
			userAccount.save(function (err, userAccount){
				
				callback(err);
			});
		}
	})
	
}

function getAllUsers(callback) {
	userModel.find(null, {
		password : 0,
		salt : 0,
		id : 0
	}, function(err, accounts) {
		callback(null, accounts);
	});

}


exports.setNewPassword = setNewPassword;
exports.userModel = userModel;
exports.getAllUsers = getAllUsers;
exports.createNewUser = createNewUser;
exports.loginUsingPassword = loginUsingPassword;
exports.doseUserExsist = doseUserExsist;
exports.isEmailAddressRegisterd = isEmailAddressRegisterd;
