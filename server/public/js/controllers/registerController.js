'use strict';

loginApp.controller('RegisterController', ['$scope', '$http', 'LoginStatusFactory', function($scope, $http, LoginStatusFactory){

	// Register form submit function
	$scope.registerSubmit = function(){
		if($scope.register_form.$valid){
			if($scope.register.password == $scope.register.passwordConfirm){
				$http({
					method: 'POST',
					url: 'https://localhost:3000/userAccount/accountTools/createNewAccount',
					data: $.param($scope.register),
					withCredentials: true
				}).success(function(data){
					$scope.registrationSuccessMessage = "Your account was created successfully";
					$scope.registrationErrorMessage = "";
					$scope.register = {};
				}).error(function(error, status){
					$scope.registrationErrorMessage = "Looks like there was a: " + status + " error";
					$scope.registrationSuccessMessage = "";
					console.log(error, status);
				});	
			}else{
				$scope.samePasswordError = 'Your password do not match';
			}
			
		}else{
			$scope.register_form.submitted = true;
		}
	};


	// Function onChange for when a username is added
	$scope.existingUsername = function(elm){
		$scope.username = elm.value; // $scope.files is set to the values of the element passed in. 
		$scope.$apply(); // Apply updates the scope when the file is added.
		$http({
			method: 'GET',
			url: 'https://localhost:3000/accountResources/existingUsername',
			params: {username: $scope.username},
			withCredentials: true
		}).success(function(data){
			if(data.result == true) {
				$scope.userNameUnavailable = "Oops, Username is already taken up";
				console.log(data.result);
			}else{
				$scope.userNameUnavailable = "";
				console.log(data.result);
			}
		}).error(function(error, status){
			console.log(error, status);
		});
	};


	// Function onChange for when a email is added
	$scope.existingEmailAddress = function(elm){
		$scope.emailAddress = elm.value; // $scope.emailAddress is set to the values of the element passed in. 
		$scope.$apply(); // Apply updates the scope when the email is added.
		$http({
			method: 'GET',
			url: 'https://localhost:3000/accountResources/registeredEmailAddress',
			params: {emailAddress: $scope.emailAddress},
			withCredentials: true
		}).success(function(data){
			if(data.result == true) {
				$scope.emailAddressUnavailable = "Oops, Email is already taken up";
				console.log(data.result);
			}else{
				$scope.emailAddressUnavailable = "";
				console.log(data.result);
			}
		}).error(function(error, status){
			console.log(error, status);
		});
	};

}]);