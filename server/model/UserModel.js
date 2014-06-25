var mongoDB = require('mongoose');
var userId = mongoDB.Schema.ObjectId;
var crypto = require('crypto');
var Schema = mongoDB.Schema;
var uuid = require('node-uuid');
var MAXIMUM_FAILED_LOGIN_ATTEMPTS = require('../config.js').MAXIMUM_FAILED_LOGIN_ATTEMPTS;
var LOCK_OUT_TIME = require('../config.js').LOCKOUT_TIME;
var PASSWORD_RECOVERY_KEY_LIFE_SPAN = require('../config.js').PASSWORD_RECOVERY_KEY_LIFE_SPAN;
var logingUtilities = require('../utilities/logger.js');
var databaseLogger = logingUtilities.logger.loggers.get('Database error');
var serverLogger = logingUtilities.logger.loggers.get('Server error');
var mailServices = require('../utilities/mailService.js');
var DATABASE_ERROR = -1;
var ACCOUNT_NOT_FOUND = 2;
var INCORRECT_PASSWORD = 3;
var UNABLE_TO_SEND_EMAIL =-2;
var INVALID_RECOVERY_KEY_OR_EMAIL_ADDRESS =4;
var EMAILADDRESS_ALREADY_IN_USE = 5;

var userSchema = mongoDB.Schema({

	username : {
		type : String,
		required : true,
		index :{
			unique : true
		}
	},
	emailAddress : {
		type : String,
		required : true,
		index : {
			unique : true
		},
		validate : /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
	},
	facebook : {
		
		acessToken : {
			type : String,
			required : false
		},
		refreshToken : {
			type : String,
			required : false
		}
	},
	// Authentication
	password : {
		type : String,
		required : true
	},
	salt : {
		type : String,
		required : true
	},
	numberOfFaildLoginAttempts : {
		type : Number,
		required : true,
		"default" : 0
	},
	accountLockedUntill : {
		type : Date,
		required : false
	},
	accountRecovery : {
		recoveryKey :{
			type: String,
			required : false
		},
		experationTime : {
			type : Date,
			required : false
		}
	},
	// User information
	firstName : {
		type : String,
		required : true
	},
	middleName : {
		type : String,
		required : false
	},
	surname : {
		type : String,
		required : false
	},
	profileDescription : {
		type : String,
		required : false,
		default : 'Enter a description about yourself. The max limit is 140 characters.'
	},
	websiteURL : {
		type: String,
		required : false,
		default : 'http://www.redninja.co.uk/'
	},
	profileImage : {
		type : String,
		required : false,
		default : 'https://pbs.twimg.com/profile_images/466574846608949248/V3xkb-VP_400x400.png',
	}

});

var userModel = mongoDB.model('User', userSchema);
exports.userModel = userModel;
function error (internalErrorCode, errorMessage){
	
	var error = new Object;
	
	error.internalErrorCode = internalErrorCode;
	error.errorMessage = errorMessage;
	
	console.log(error);
	return error;
}

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
}

var userModel = mongoDB.model('User', userSchema);
exports.userModel = userModel;

// Validates user credentials against the stored values before returning the
// user data if the credentials are correct
function loginUsingPassword(accountIdentifier, password, callback) {

	userModel.findOne({
		$or : [ {username : accountIdentifier } , {emailAddress : accountIdentifier} ]
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
				
				userAccount.save(function (err, userAccount){
					
					if (err){
						
						callback(error(DATABASE_ERROR_ ))
					}
				});
				
				// RUN IF PASSWORD IS CORRECT

				// Returns the data retrived from the database
				return callback(null, userAccount);
				
			} else {
				
				userAccount.numberOfFaildLoginAttempts += 1;
				
				if (userAccount.numberOfFaildLoginAttempts > MAXIMUM_FAILED_LOGIN_ATTEMPTS){
					
					userAccount.accountLockedUntill = ((new Date).setHours((new Date).getHours() + LOCK_OUT_TIME));
					return calback(new Error('Account now locked'));
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
exports.loginUsingPassword = loginUsingPassword;


// Creates a new user account adding it to the database
function createNewUser (username, password, emailAddress, firstName, middleName, surname, callback) {

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
exports.createNewUser = createNewUser;

// Checks to see if a user account with the specified username exsists
function doseUserExsist(username, callback) {

	userModel.find({
		username : username
	}, null, function(err, result) {

		if (err){
					
			callback(err);
					
		} else {
					
			if (result.length === 1){
									
				callback(null, true);
								
			}else {
									
				callback(null, false);
			}
		}
	});
}
exports.doseUserExsist = doseUserExsist;

// Checks to see if an account with the specified email address exsists
function isEmailAddressRegistered (emailAddress, callback){
	
	userModel.find({
		emailAddress : emailAddress
	}, null, function (err, result){
		
		if (err){
			
			callback(err);
			console.log(err);
			
			
		} else {
			
			if (result.length === 1){
							
				callback(null, true);
						
			}else {
							
				callback(null, false);
			}
		}
	});
}
exports.isEmailAddressRegistered = isEmailAddressRegistered;

function getAllUsers(callback) {
	
	userModel.find(null, {password:0, accountRecovery:0, salt:0, numberOfFaildLoginAttempts:0, _id:0, __v:0}, function (err, userAccounts){
		
		if (err) {
			databaseLogger.error(err.message);
			callback(err,null);
		}else  {
			
			callback(null, userAccounts)
		}
	});
}
exports.getAllUsers = getAllUsers;

function getUserAccountByEmail (emailAddress, callback){
	
	userModel.findOne({emailAddress : emailAddress}, function (err, userAccount){
		
		if (err){
			
			databaseLogger.error(err);	
			callback(error(DATABASE_ERROR, 'internal database error'));
			return;
			
		}else if (userAccount == null){
			
			callback(error(ACCOUNT_NOT_FOUND, 'user account not found'));
			return;
			
		}else {
			
			callback(null, userAccount);
			return;
		}
	});
}
exports.getUserAccountByEmail = getUserAccountByEmail;

function setNewPassword(emailAddress, oldPassword, newPassword, callback){
	
	getUserAccountByEmail (emailAddress, function (err, userAccount){
		
		if (err){
			
			callback(err);
			
		}else {
			
			if (isValidPassword(oldPassword, userAccount.password, userAccount.salt)){
							
				userAccount.salt = saltValue;
				userAccount.password =  createHash(newPassword, saltValue);
				
				userAccount.save(function (err, userAccount){
								
					if (err){
									
						callback(error(DATABASE_ERROR, 'Internal database error'));
						return;			
									
					} else {
									
						callback(null);
						return 			
					}
					
				});
						
			}else {
							
				callback(error(INCORRECT_PASSWORD, 'Password provided was incorrect'));
				return;
							
			}
		}
	});
}
exports.setNewPassword = setNewPassword;

function createRecoveryKey (emailAddress, callback) {
	
	getUserAccountByEmail(emailAddress, function (err, userAccount){
			
		if (err){
				
			callback(err)
				
		}else {
			
			var CHARACTERSET = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
			var recoveryKey = '';

				do {

					var characterSetIndex = Math.floor((Math.random() * CHARACTERSET.length));
					
					recoveryKey += CHARACTERSET.charAt(characterSetIndex);

				} while (recoveryKey.length != 40);

						
				userAccount.accountRecovery.experationTime = ((new Date).setHours((new Date).getHours() + PASSWORD_RECOVERY_KEY_LIFE_SPAN));
				userAccount.accountRecovery.recoveryKey = recoveryKey;
								
				userAccount.save(function (err, userAccount){
							
					if (err){
											
						databaseLogger.error(err.message);
						callback(err);
											
					} else {
														
						mailServices.sendEmail(emailAddress, 'Account Recovery', 'Hi there, he is a link to recovery your account', 
							'<a href=https://localhost:3000/#/password-reset?recoveryKey=' + recoveryKey +'&emailAddress=' + emailAddress + '> click here </a>', function (err){

						if (err != null){
							
							serverLogger.error(err);
							callback(error (UNABLE_TO_SEND_EMAIL, 'Unable to send recovery email'));
									
						}else{
											
							callback(null);
						
						}
										
					});

				serverLogger.info('Recovery key issued to ' + emailAddress);
											
				}	
			});	
		}
	});
}
exports.createRecoveryKey = createRecoveryKey;

function changePasswordViaRecoveryKey (newPassword, recoveryKey, emailAddress, callback){
	
	userModel.findOne({emailAddress: emailAddress, 'accountRecovery.recoveryKey' : recoveryKey }, null , function (err, userAccount){

		if (err){

			databaseLogger.error(err);
			callback(err);
		
		}else if (userAccount == null){

			callback(error(INVALID_RECOVERY_KEY_OR_EMAIL_ADDRESS, 'No account with that recovery key found'));
		
		}else if (!(userAccount.accountRecovery.experationTime > new Date)){

			callback(error());

		}else {
			
			userAccount.salt = saltValue;
			
			userAccount.password =  createHash(newPassword, saltValue);
			
			userAccount.accountRecovery.recoveryKey = '';
			
			userAccount.save(function (err, userAccount){

				if (err){
									
					databaseLogger.error(err.message);
					callback(err);			
					return
					
				}else {

					callback(null);
					return;
				}
			});
		}
	});
}
exports.changePasswordViaRecoveryKey = changePasswordViaRecoveryKey;


function changeEmailAddress (emailAddress ,newEmailAddress, callback){
	
	
	getUserAccountByEmail(emailAddress, function(err, userAccount){
		
		if (err){
			
			callback(err);
			
		} else {
			
			isEmailAddressRegistered(newEmailAddress, function (err, exsists){
				
				if (exsists){
					
					callback(error(EMAILADDRESS_ALREADY_IN_USE, 'Email address is already in use'));
			
				}else  {
					
					userAccount.emailAddress = newEmailAddress;
					userAccount.save(function (err, exsists){
						
						if (err){
							
							callback(error(DATABASE_ERROR, 'Internal database error'));
							
						}else {
							
							callback(null, userAccount);
						}
					});
					
				}
			});
		}
	});
}
exports.changeEmailAddress = changeEmailAddress;

function changeAccountHolderName (emailAddress, firstName, middleName, surname, callback){
	
	getUserAccountByEmail(emailAddress, function (err, userAccount){
		
		if (firstName != undefined){
			
			userAccount.firstName = firstName;
			
		}
		
		if (middleName != undefined) {
			
			userAccount.middleName = middleName;
		}
		
		if (surname != undefined){
			
			userAccount.surname = surname;
		}
		
		userAccount.save(function(err, userAccount){
			
			if (err){
				
				callback(error(DATABASE_ERROR, 'Internal database error'));
				return;
				
			}else {
				
				callback(null, userAccount);
				return;
			}
		});
	});
}
exports.changeAccountHolderName = changeAccountHolderName;

function changeWebsiteURL(emailAddress, websiteURL, callback){
	
	getUserAccountByEmail(emailAddress, function (err, userAccount){
		
		if (err){
			
			callback(err);
			return;
			
		}else {
			
			userAccount.websiteURL = websiteURL;
			userAccount.save(function(err, userAccount){
				
				if (err){
					
					callback(error(DATABASE_ERROR, 'Internal database error'));
					return;
					
				}else {
					
					callback(null, userAccount);
					return;
				}	
			});
		}
	});
}
exports.changeWebsiteURL = changeWebsiteURL;

function changeProfileDescriptioni(emailAddress, profileDescription, callback){
	
	getUserAccountByEmail(emailAddress, function (err, userAccount){
		
		if (err){
			
			callback(err);
			return;
			
		}else {
			
			userAccount.profileDescription = profileDescription;
			userAccount.save(function(err, userAccount){
				
				if (err){
					
					callback(error(DATABASE_ERROR, 'Internal database error'));
					return;
					
				}else {
					
					callback(null, userAccount);
					return;
				}	
			});
		}
	});
}
exports.changeProfileDescriptioni = changeProfileDescriptioni;

function removeAccount (emailAddress, password, callback){
	
	getUserAccountByEmail(emailAddress, function (err, userAccount){
		
		if (err){
			
			callback(err);
		}else {
			
			if (isValidPassword(password, userAccount.password, userAccount.salt)){
				
				userAccount.remove(function (err, userAccount){
					
					if (err){
						
						callback(error(DATABASE_ERROR, 'Internal database error'));
						return;
						
					}else {
						
						callback(null);
						return;
					}
				});
			}else {
				
				callback(error(INCORRECT_PASSWORD, 'Password provided was incorrect'));
				return;
			}
		}
	});
	
}
exports.removeAccount = removeAccount;