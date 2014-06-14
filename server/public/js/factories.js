'use strict';

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

// === FACTORY TO SELECT LOGGED IN USER === //
loginApp.factory('userFactory', function(){
	// Empty object to logged in user
	var user = [];	
	return {
		// getUser returns the value of the user object
		getUser: function(){
			return user;
		},
		// setUser passes in then sets the value of the user object 
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
		// getUsers returns the value of the users object.
		getUsers: function(){
			return users;
		},
		// setUsers passes in then sets the value of the users object.
		setUsers: function(val){
			users = val;
		}
	};
});

// === PROFILE FACTORY TO VIEW USER PROFILE === //
loginApp.factory('ProfileFactory', function(){
	// Empty object to store chosen member array.
	var user_profile = [];	
	return {
		// getUserProfile returns the value of the chosen_memb object
		getUserProfile: function(){
			return user_profile;
		},
		// setUserProfile passes in then sets the value of the chosen_memb object 
		setUserProfile: function(chose){
			user_profile = chose;
		}
	};
});

// === LOGGED IN FACTORY TO SEE IF THE USER IS LOGGED IN === //
loginApp.factory('loggedInFactory', function () { 
	// Empty var to store true or false string
	var logged = '';
	return {
		// getLoginStatus returns the string or empty string within logged var 
		getLoginStatus: function() {
			return (logged);
		},
		// setLoginStatus passes in then sets the string or empty string of the logged var 
		setLoginStatus: function(value) {
			logged = value;
		}
	};
});