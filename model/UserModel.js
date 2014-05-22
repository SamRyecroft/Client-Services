var mongoDB = require('mongoose');
var userId = mongoDB.Schema.ObjectId;
var crypto = require('crypto');
var Schema = mongoDB.Schema;
var uuid = require('node-uuid');
var serverConfiguration = require('../config');


console.log(serverConfiguration.MONGODBADDRESS);
mongoDB.connect(serverConfiguration.MONGODBADDRESS);

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

// Sets the password and the salt value used to hash the password of the user
function setPassword(password) {

	this.password = createHash(password, saltValue);
	this.salt = saltValue;
};

// Creates a hash value of a password with a specified salt against a already hashed password
function isValidPassword(password, hashedPassword, saltValue) {

	return hashedPassword === createHash(password, saltValue);

};

var userModel = mongoDB.model('User', userSchema);

// Validates user credentials against the stored values before returning the
// user data if the credentials are correct
function loginUsingPassword(accountIdentifier, password, callback) {

	userModle.findOne({
		$or : [ {
			username : accountIdentifier
		}, {
			email : accountIdentifier
		} ]
	}, function(err, userAccount) {

		if (err || (userAccount == null)) {

			// Returns an error if no user account was found with the specified username or email address
			return callback(new Error('The user was not found :('));

		}

		// Uses the isValidPassword method to check if the password entered matches the one on record
		if (isValidPassword(password, data.password, data.salt)) {

			// RUN IF PASSWORD IS CORRECT

			// Returns the data retrived from the database
			return callback(null, data);

		} else {

			// RUN IF PASSWORD IS INCORRECT 
			return callback(new Error('invalid password'));

		}
	});
}

// Creates a new user account adding it to the database
function createNewUser(username, password, emailAddress, firstName, middleName, surname, callback) {
	
	var userAccount = new userModel({
		username:username,
		password:createHash(password, saltValue),
		salt:saltValue,
		emailAddress:emailAddress,
		firstName:firstName,
		middleName:middleName,
		surname:surname
	});
	
	userAccount.save(function(err, userAccount){
		
		if (err){
			console.error(err);
			callback(new Error("Duplicate user :("));
			
		}
		
	});
}

exports.createNewUser = createNewUser;
exports.loginUsingPassword = loginUsingPassword;