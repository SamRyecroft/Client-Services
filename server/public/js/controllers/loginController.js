'use strict';

loginApp.controller('LoginController', ['$scope', '$http', '$cookies', '$location', 'loggedInFactory', 'userFactory', function($scope,  $http, $cookies, $location, loggedInFactory, userFactory){
		
	// Log in submit funciton
	$scope.loginSubmit = function(){
		if($scope.login_form.$valid){ // If login_form is valid, do the following
			$http({
				method: 'POST',
				url: 'https://localhost:3000/accountAuthentication/login',
				data: $.param($scope.login),
				withCredentials: true
			}).success(function(data, status){
				loggedInFactory.setLoginStatus(true);
				//userFactory.setUser(user);
				$location.path("/welcome");
				console.log("success from Login");
			}).error(function(error, status){
				$scope.loginErrorMessage = "Login details are incorrect. Try again.";
				console.log(error, status);
			});       
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.login_form.submitted = true;
		}
	};

}]);