'use strict';

loginApp.controller('RegisterController', ['$scope', '$http', 'LoginStatusFactory', function($scope, $http, LoginStatusFactory){

	// Register form submit function
	$scope.registerSubmit = function(){
		if($scope.register_form.$valid){ // If the form is valid do the following.
			$http({
				method: 'POST',
				url: 'https://localhost:3000/userAccount/accountTools/CreateNewAccount',
				data: $.param($scope.register),
				withCredentials: true
			}).success(function(data){
				$scope.registrationSuccessMessage = "Your account was created successfully";
				$scope.registrationErrorMessage = "";
				$scope.register = {};
			}).error(function(error, status){
				$scope.registrationErrorMessage = "Looks like there was a: " + status + " error";
				$scope.registrationSuccessMessage = "";
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.register_form.submitted = true;
		}
	};

}]);