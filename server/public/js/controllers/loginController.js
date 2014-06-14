'use strict';

loginApp.controller('LoginController', ['$scope', '$http', '$cookies', '$location', 'loggedInFactory', 'userFactory', function($scope, $http, $cookies, $location, loggedInFactory, userFactory){
	
	// Log in submit funciton
	$scope.loginSubmit = function(){
		if($scope.login_form.$valid){ // If login_form is valid, do the following
			$http({
				method: 'POST',
				url: 'https://localhost:3000/auth/login',
				data: $.param($scope.login)
			}).success(function(data, status){
				loggedInFactory.setLoginStatus(true);
				$scope.login = {};
				console.log('Success from Login');
				$location.path("/welcome");
			}).error(function(error, status){
				$scope.loginErrorMessage = "Incorrect Dteails.";
				console.log(error, status, ' from Login');
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.login_form.submitted = true;
		}
	};

}]);