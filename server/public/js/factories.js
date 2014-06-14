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

// === PROFILE FACTORY TO VIEW MEMBER PROFILE === //
loginApp.factory('setMembersFactory', function(){
	// Empty object to store chosen member array of values
	var membs = [];	
	return {
		// getChosenMemb returns the value of the chosen_memb object
		getMembs: function(){
			return membs;
		},
		// setChosenMemb passes in then sets the value of the chosen_memb object 
		setMembs: function(val){
			membs = val;
		}
	};
});

// === PROFILE FACTORY TO VIEW MEMBER PROFILE === //
loginApp.factory('profileFactory', function(){
	// Empty object to store chosen member array of values
	var chosen_memb = [];	
	return {
		// getChosenMemb returns the value of the chosen_memb object
		getChosenMemb: function(){
			return chosen_memb;
		},
		// setChosenMemb passes in then sets the value of the chosen_memb object 
		setChosenMemb: function(chose){
			chosen_memb = chose;
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

// === PROFILE FACTORY TO SELECT LOGGED IN MEMBER PROFILE === //
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