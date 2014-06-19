'use strict';

loginApp.controller('LoginController', ['$scope', '$http', '$cookies', '$timeout', '$location', 'LoginStatusFactory', 'LoggedInUserFactory', 'ProfileFactory', function($scope, $http, $cookies, $timeout, $location, LoginStatusFactory, LoggedInUserFactory, ProfileFactory){
		
	$scope.loginSubmit = function(){
		if($scope.login_form.$valid){
			$http({
				method: 'POST',
				url: 'https://localhost:3000/auth/login',
				data: $.param($scope.login)
			}).success(function(data){
				LoginStatusFactory.setLoginStatus(true);
				$scope.login = {};
				$timeout(function() {
					ProfileFactory.setUserProfile(angular.fromJson($cookies.userInfoCookie));
					$location.path('/welcome');
				}, 100);
			}).error(function(error, status){
				$scope.loginErrorMessage = "Oops. " + error.error;
				console.log(error, status, ' from Login');
			});
		}else{
			$scope.login_form.submitted = true;
		}
	};

}]);