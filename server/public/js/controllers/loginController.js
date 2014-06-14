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
				console.log('success from Login');
				$scope.login = {};
				userFactory.setUser($cookies.userInfoCookie);
				//$location.path("/welcome");
			}).error(function(error, status){
				$scope.loginErrorMessage = "Login details are incorrect. Try again.";
				console.log(error, status, 'success from Login');
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.login_form.submitted = true;
		}
	};

}]);