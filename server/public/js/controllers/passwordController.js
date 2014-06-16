'use strict';

loginApp.controller('PasswordController', ['$scope', 'memberFactory', function($scope, $http, memberFactory){
	
	memberFactory.getMembers().success(function(data, status){
			$scope.members = data;
			console.log($scope.members, 'hello');
		}).error(function(error, status){
			console.log(error, status);
		});
	
	$scope.passwordRetrieve = "Forgot Password"; // When details are valid this will be set to the users' password.
	
	$scope.passwordAuth = false; // If true, the if statemenet at the bottom will not run.
	
	// Retrieve password function.
	$scope.passwordSubmit = function(){
		if($scope.password_form.$valid){ // If the form is valid do the following.	
			for (var i=0; i<$scope.members.length; i++) {
				// If the username and email entered are the same as ones in the list do the following.
				if ($scope.members[i].username == $scope.password.username && $scope.members[i].email == $scope.password.email) {
					$scope.passwordRetrieve = "Your Password Is: " + $scope.members[i].password; // Set the password
					$scope.passwordAuth = true; // Set password error to true, which will stop $scope.passwordErrorMessage being set.
					break;
				}
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.password_form.submitted = true;
		}
		
		// If $scope.passwordAuth is false anf the form is valid.
		if (!$scope.passwordAuth && $scope.password_form.$valid){
			$scope.passwordErrorMessage = "Those details don't match any we have"; // Set an error message.
		}
		
		
	};
	
}]);