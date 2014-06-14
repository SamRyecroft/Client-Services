'use strict';

loginApp.controller('PasswordEmailController', ['$scope', '$http', function($scope, $http){
	// Retrieve password function.
	$scope.passwordEmailSubmit = function(){
		if($scope.email_form.$valid){
			$http({
				method: 'POST',
				url: 'https://localhost:3000/',
				data: $.param($scope.password.emailAddress),
				withCredentials: true
			}).success(function(data){
				$scope.emailAddressSuccessMessage = "Check your email in a minute or so";
				console.log('success', $scope.password.email);
			}).error(function(error, status){
				$scope.emailAddressErrorMessage = "Looks like there was a: " + status + " error";
				console.log('error');
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.email_form.submitted = true;
		}		
	};
}]);