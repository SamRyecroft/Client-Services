var passport = require('passport');
var FacebookStrategy = require ('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('../config.js');
var userModel = require('../controller/account_api.js').userModel;

passport.use(new FacebookStrategy({
	
	clientID: config.FACEBOOK_APP_ID,
	clientSecret :config.FACEBOOK_APP_SECRET,
	callbackURL : 'https://localhost:3000/auth/facebook/callback'
}, 

function (accessToken, refreshToken, profile, callback){

	console.log(accessToken, refreshToken);

	userModel.isEmailAddressRegistered(profile.emails[0].value, function (err,exsists){
		
		
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

passport.use(new GoogleStrategy({
    returnURL: 'https://localhost:3000/auth/google/callback',
    realm: 'https://localhost:3000'
  },
  function(identifier, profile, callback) {
	console.log(profile);
    userModel.isEmailAddressRegistered(profile.emails[0].value, function (err,exsists){
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
	});  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
exports.passport = passport;