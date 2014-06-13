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
			profileInfomation : {
				type : String,
				required : false
			}

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
}

var userModel = mongoDB.model('User', userSchema);

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
				
				userAccount.save();
				
				// RUN IF PASSWORD IS CORRECT

				// Returns the data retrived from the database
				return callback(null, userAccount);
				
			} else {
				
				userAccount.numberOfFaildLoginAttempts += 1;
				
				if (userAccount.numberOfFaildLoginAttempts > MAXIMUM_FAILED_LOGIN_ATTEMPTS){
					
					
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

// Checks to see if a user account with the specified username exsists
function doseUserExsist(username, callback) {

	userModel.find({
		username : username
	}, null, function(err, results) {

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

// Checks to see if an account with the specified email address exsists
function isEmailAddressRegisterd (emailAddress, callback){
	
	userModel.find({
		emailAddress : emailAddress
	}, null, function (err, results){
		
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
	
	userModel.find(null, {password:0, accountRecovery:0, salt:0, numberOfFaildLoginAttempts:0, _id:0, __v:0}, function (err, userAccounts){
		
		if (err) {
			databaseLogger.error(err.message);
			callback(err,null);
		}else  {
			
			callback(null, userAccounts)
		}
	});
}

function createRecoveryKey (emailAddress, callback) {
	
	userModel.findOne(
			{ emailAddress : emailAddress}
				, null, function (err, userAccount){
			
		if (err){
				
			databaseLogger.error(err.message);
			callback(err);
				
		}else {
				
			if (userAccount != null){
					
				var CHARACTERSET = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
				var recoveryKey = '';

				do {

					var characterSetIndex = Math
						.floor((Math.random() * CHARACTERSET.length));
					recoveryKey += CHARACTERSET.charAt(characterSetIndex);

				} while (recoveryKey.length != 40);

				userAccount.accountRecovery.key = recoveryKey;
				userAccount.accountRecovery.experationTime = ((new Date).setHours((new Date).getHours() + PASSWORD_RECOVERY_KEY_LIFE_SPAN));
						
				userAccount.save(function (err, userAccount){
							
					if (err){
									
						databaseLogger.error(err.message);
						callback(err);
									
					} else {
												
						mailServices.sendEmail(emailAddress, 'Account Recovery', 'Hi there, he is a link to recovery your account', 
							'<a href="...?recoveryKey' + recoveryKey +'&emailAddress=' + emailAddress + '> click here </a>', function (err){

								if (err != null){
									serverLogger.error(err);
									callback(new Error ('key issued but email failed to send'));
							
								}else{
									
									callback(null);
								}
								
							});

						serverLogger.info('Recovery key issued to ' + emailAddress);
									
					}	
				});
						
			}else {

				callback(new Error('Account not found'));
			}
		}
	});		
}

function changePasswordViaRecoveryKey (newPassword, recoveryKey, emailAddress, callback){

	userModel.findOne({emailAddress: emailAddress, 'accountRecovery.recoveryKey' : recoveryKey }, null , function (err, userAccount){

	console.log(userAccount);

		if (err){

			databaseLogger.error(err);
			callback(err);
		
		}else if (userAccount == null){

			callback(new Error('There is no account with that username and recovery key'));
		
		}else if (!(userAccount.accountRecovery.experationTime > new Date)){

			callback(new Error('recovery key expiered'));

		}else {

			userAccount.password =  createHash(newPassword, saltValue);
			userAccount.saltValue = saltValue;

			userAccount.save(function (err, userAccount){

				if (err){
									
					databaseLogger.error(err.message);
					callback(err);			
					
				}else {

					callback(null);

				}

			});
		}
	});
}

function updateUserInfomation (emailAddress, firstName, middleName, surname, profileInfomation, callback){
	
	userModel.findOne({emailAddress : emailAddress} , function(err, userAccount){

		if (firstName != undefined) {

			userAccount.firstName = firstName;
		}

		if (middleName != undefined) {

			userAccount.middleName = middleName;

		}

		if (surname != undefined) {

			userAccount.surname = surname;

		}

		if (profileInfomation != undefined) {

			userAccount.profileInfomation = profileInfomation;

		}

		userAccount.save(function(err){

			if (err){
									
				databaseLogger.error(err.message);
				callback(err);
									
			} else {

				callback(null);

			}


		});

	});
}

function removeAccount (emailAddress, callback){
	
	userModel.remove({emaillAddress : emailAddress}, {justOne : true}, function (err){
		
		if (err){
			
			callback(err);
		
		}else {
			
			callback(null);
		}
	});
}

exports.removeAccount = removeAccount;
exports.updateUserInfomation = updateUserInfomation;
exports.changePasswordViaRecoveryKey = changePasswordViaRecoveryKey;
exports.createRecoveryKey = createRecoveryKey;
exports.setNewPassword = setNewPassword;
exports.userModel = userModel;
exports.getAllUsers = getAllUsers;
exports.createNewUser = createNewUser;
exports.loginUsingPassword = loginUsingPassword;
exports.doseUserExsist = doseUserExsist;
exports.isEmailAddressRegisterd = isEmailAddressRegisterd;
