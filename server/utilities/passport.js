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

	userModel.isEmailAddressRegistered(profile.emails[0].value, function (err,exsists){
		
		
		if (err){
			
			callback(err, false);
			
		} else if (exsists) {
			
			userModel.getUserAccountByEmail(profile.emails[0].value, function (err, userAccount){
				
				if (err){	
					
					callback(err, null)
					
				} else {
					
					var account = new Object;
					account.exsists = true;
					account.account = userAccount;
					
					callback(null, account);
				}
			});
			
			}else {
					var account = new Object;
					account.exsists = false;
					account.account = profile;
					
				callback(null, account);
			}
		});
	}	
));

passport.use(new GoogleStrategy({
    returnURL: 'https://localhost:3000/auth/google/callback',
    realm: 'https://localhost:3000'
  },
  function(identifier, profile, callback) {
	
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
		
			callback(null, false);
		}
	});  }
));

passport.serializeUser(function(user, done) {
  done(null, user.account.username);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
exports.passport = passport;