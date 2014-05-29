'use strict';

var loginApp = angular.module('loginApp', ['ConfigModule']);

// === LOGIN CONTROLLER === //
loginApp.controller('LoginController', function ($scope, $location, memberFactory) {

	// Populating $scope.members with the members arrays from memberFactory.
	$scope.members = memberFactory.getMembers();
	
	// Setting the login form submit value to false, will be set to true if the form is invalid on submit
	// if set to true it will allow the ng-show error messages to be displayed.
	$scope.submitted = false;

	// The function that is called when the login form is submitted.
	$scope.loginSubmit = function(){
		// Checking if the form is valid (enough characters, correct type etc).
		if($scope.login_form.$valid){
			// If form is valid, loop through $scope.members to see if the details entered have a match.
			for (var i=0; i<$scope.members.length; i++){
				// If the details entered do have a match set the location of the view to /welcome.
				if ($scope.members[i].username == $scope.login.username && $scope.members[i].password == $scope.login.password){
					$location.url("/welcome");
					break;
				}
				// If the details do not have a match set $scope.loginError an error message to display to the view.
				$scope.loginError = "Login details are invalid";
			}
		// Setting the login form submit value to true, allows for the ng-show error messages to be displayed.
		}else{
			$scope.login_form.submitted = true;
		}
	}

});


// === REGISTER CONTROLLER === //
loginApp.controller('RegisterController', function($scope, $location, memberFactory){

	// Populating $scope.members with the members arrays from memberFactory.
	$scope.members = memberFactory.getMembers();
	
	// Setting the login form submit value to false, will be set to true if the form is invalid on submit
	// if set to true it will allow the ng-show error messages to be displayed.
	$scope.submitted = false;

	// The function that is called when the register form is submitted.
	$scope.registerSubmit = function(){
		// Checking if the register form is valid (enough characters, correct type etc).
		if($scope.register_form.$valid){
			// If register form is valid, loop through $scope.members to see if the username entered has a match.
			for (var i=0; i<$scope.members.length; i++) {
				// If the username entered do have a match set $scope.registrationError to true 
				// and assign an error message to $scope.registrationErrorMessage to display to the view.
				if ($scope.members[i].username == $scope.register.username) {
					$scope.registrationError = true;
					$scope.registrationErrorMessage = "Select a different username";
					break;
				}
			}
		// Setting the register form submit value to true, allows for the ng-show error messages to be displayed.
		}else{
			$scope.register_form.submitted = true;
		}

		// Setting $scope.registrationError is false and the register form is valid 
		// push the registration details to $scope.members and set the location of the view to /login
		if (!$scope.registrationError && $scope.register_form.$valid){
			$scope.members.push({username:$scope.register.username, email:$scope.register.email, password:$scope.register.password});
			$location.url("/login");
		}
	}

});


// === WELCOME CONTROLLER === //
loginApp.controller('WelcomeController', function($scope, memberFactory){
	
	// Populating $scope.members with the members arrays from memberFactory.
	$scope.members = memberFactory.getMembers();

	// $scope.sortField defines the intial orderBy property to filter the members list in /welcome view.
	$scope.sortField = 'username';
	// reverse enables the sortField filter results to be displayed in opposite order once clicked. (From A-Z to Z-A).
	$scope.reverse = false;

});


// === WELCOME CONTROLLER === //
loginApp.controller('PasswordController', function($scope, memberFactory){

	// Populating $scope.members with the members arrays from memberFactory.
	$scope.members = memberFactory.getMembers();
	
	// $scope.passwordRetrieve will be assigned the users's password if the details they provide are correct.
	$scope.passwordRetrieve = "Retrieve Your Password";
	
	// The function that is called when the password form is submitted.
	$scope.passwordSubmit = function(){
		// Checking if the password form is valid (enough characters, correct type etc).
		if($scope.password_form.$valid){
			// If register form is valid, loop through $scope.members to see if the username and email entered have a match.
			for (var i=0; i<$scope.members.length; i++) {
				// If the username and email entered do have a match set $scope.passwordRetrieve to the relevant password 
				// and assign $scope.passwordError to true.
				if ($scope.members[i].username == $scope.password.username && $scope.members[i].email == $scope.password.email) {
					$scope.passwordRetrieve = "Your Password Is: " + $scope.members[i].password;
					$scope.passwordError = true;
					break;
				}
			}
		}
		// Setting the password form submit value to true, allows for the ng-show error messages to be displayed.
		else{
			$scope.password_form.submitted = true;
		}

		// Setting $scope.passwordError is false and the password form is valid 
		// set $scope.passwordErrorMessage an error message to display to the view.
		if (!$scope.passwordError && $scope.password_form.$valid){
			$scope.passwordErrorMessage = "Those details don't match any we have";
		}
	}

	
});



// === ROOTSCOPE LOGIN FUNCTION (COMMENTED OUT BECAUSE IT DOES NOT HOLD VALUES OR ALLOW BACK BUTTON) === //
/*
loginApp.run(function(LoginFactory, $rootScope, $location) {
	$rootScope.$on('$routeChangeStart', function(evt) {
		if(!LoginFactory.validLogin){
			$location.url("/login");
		}
		event.preventDefault();
	});
});
*/