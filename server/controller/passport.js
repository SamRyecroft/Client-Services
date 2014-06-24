var passport = require('passport');
var FacebookStrategy = require ('passport-facebook').Strategy;
var config = require('../config.js');
var userModel = require('./account_api.js').userModel;
passport.use(new FacebookStrategy({
	
	clientID: config.FACEBOOK_APP_ID,
	clientSecret :config.FACEBOOK_APP_SECRET,
	callbackURL : 'https://localhost:3000/auth/facebook/callback'
}, 

function (accessToken, refreshToken, profile, callback){

	userModel.isEmailAddressRegistered(profile.emails[0].value, function (err,exsists){
		
		console.log(profile.emails[0].value);
		console.log(exsists);
		
		if (err){
			
		} else if (exsists) {
			
			userModel.getUserAccountByEmail(profile.emails[0].value, function (err, userAccount){
				
				if (err){	
					
				} else {
					
					callback(null, userAccount);
				}
			});
			
		}else {
			
			
		}
	});
}	
));
