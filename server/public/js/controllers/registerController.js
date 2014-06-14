'use strict';

loginApp.controller('RegisterController', ['$scope', '$http', 'loggedInFactory', function($scope, $http, loggedInFactory){
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
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
			}).error(function(error, status){
				$scope.registrationErrorMessage = "Looks like there was a: " + status + " error";
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.register_form.submitted = true;
		}
	};

}]);