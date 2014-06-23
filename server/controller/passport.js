var passport = require('passport');
var facebookStrategy = require ('passport-facebook');
var config = require('../config.js');
var userModel = require ('../model/userModel.js')
passport.use(new FacebookStrategy{
	
	clientID: config.FACEBOOK_APP_ID;
	clientSecret :config.FACEBOOK_APP_SECRET;
	callbackURL : 'localhost callback!';
}, 

function (accessToken, refreshToken, profile, callback){
		
	userModel.isEmailAddressRegistered(profile.emailAddress[0], function (err,exsists){
		
		if (err){
			
		} else if (exsits) {
			
			userModel.getUserAccountByEmail(profile.emailAddress[0] function (err, userAccount){
				
				if (err){
					
				} else {
					
					callback(null, userAccount);
				}
			});
			
		}else {
			
			userModel.createNewUser();
		}
	});
	
}