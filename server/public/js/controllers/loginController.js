'use strict';

loginApp.controller('LoginController', ['$scope', '$http', '$location', 'memberFactory', 'loggedInFactory', 'userFactory', function($scope, $http, $location, memberFactory, loggedInFactory, userFactory){

	// Getting current members from the memberFactory. Then suing the success, error promises.
	memberFactory.getMembers().
		success(function(data, status){
			$scope.members = data;
		}).
		error(function(error, status){
			console.log(error, status);
		});

	$scope.submitted = false; // If true the error message will be able to be shown.

	$scope.loginValid = false; // If true $scope.loginErrorMessage will not be used.
	
	// Log in submit funciton
	$scope.loginSubmit = function(){
		if($scope.login_form.$valid){ // If login_form is valid, do the following 
				
				$http({
			        method  : 'POST',
			        url     : 'https://localhost:3000/login',
			        data    : $.param($scope.login),
			        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			    }).success(function(data){
			    	console.log('success');
			    }).error(function(error, status){
			    	console.log(error, status);
			    });
						
			/*
			for (var i=0; i<$scope.members.length; i++){ // Loop through $scope.members
				// If the username and password do have a match
				if ($scope.members[i].username == $scope.login.username && $scope.members[i].password == $scope.login.password){
					loggedInFactory.setLoginStatus(true); // Set loggedInFactory to true
					$scope.loginValid = true; // Set loginValid to true.
					userFactory.setUser($scope.members[i]); // Set the current member to userFactory.setUser($scope.members[i])
					$location.path("/welcome"); // Direct the location to the /welcome view. 
					break;
				};
			};
*/
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.login_form.submitted = true;
		}

		// If $scope.loginValid is false and the login_form is valid set $scope.loginErrorMessage.
		if(!$scope.loginValid && $scope.login_form.$valid){
			$scope.loginErrorMessage = "Login details are incorrect. Try again.";
		};	
	};

}]);