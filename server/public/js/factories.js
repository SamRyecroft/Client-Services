'use strict';

// === FACTORY TO CHECK LOGIN STATUS === //
loginApp.factory('LoginStatusFactory', function () { 
	// Empty var to store true or false string
	var logged = false;
	return {
		// getLoginStatus returns the string or empty string of var logged
		getLoginStatus: function() {
			return logged;
		},
		// setLoginStatus set var logged to the value passed in.
		setLoginStatus: function(value) {
			logged = value;
		}
	};
});

// === FACTORY TO SELECT THE LOGGED IN USER === //
loginApp.factory('LoggedInUserFactory', function(){
	// Empty object to logged in user
	var user = [];	
	return {
		// getLoginStatus returns the string or empty string of var user
		getUser: function(){
			return user;
		},
		// setUser sets var user to the value passed in.
		setUser: function(infoCookie){
			user = infoCookie;
		}
	};
});

// === FACTORY TO SELECT ALL USERS === //
loginApp.factory('UsersFactory', function(){
	// Empty object to store users.
	var users = [];	
	return {
		// getLoginStatus returns the string or empty string of var users
		getUsers: function(){
			return users;
		},
		// setUsers sets var users to the value passed in.
		setUsers: function(val){
			users = val;
		}
	};
});

// === FACTORY TO SET DIFFERENT USERS TO VIEW THEIR PROFILE === //
loginApp.factory('ProfileFactory', function(){
	// Empty object to store chosen user profile.
	var user_profile = [];	
	return {
		// getLoginStatus returns the string or empty string of var user_profile
		getUserProfile: function(){
			return user_profile;
		},
		// setUserProfile sets var user_profile to the value passed in.
		setUserProfile: function(chose){
			user_profile = chose;
		}
	};
});

// === MEMBER FACTORY TO STORE CURRENT MEMBERS === //
/*
loginApp.factory('memberFactory', function($http) {

	return {
		getMembers: function() {
			return $http.get('https://localhost:3000/accountResources/allUsers.json');
		}
	};
});
*/