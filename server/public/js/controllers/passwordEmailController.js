'use strict';

loginApp.controller('PasswordEmailController', ['$scope', '$http', function($scope, $http){
	// Retrieve password function.
	$scope.passwordEmailSubmit = function(){
		if($scope.email_form.$valid){
			$http({
				method: 'GET',
				url: 'https://localhost:3000/userAccount/accountTools/accountRecovery/generateRecoveryKey',
				data: $.param($scope.password.emailAddress)
			}).success(function(data){
				$scope.emailAddressSuccessMessage = "Check your email in a minute or so";
				console.log('success', $scope.password.emailAddress);
			}).error(function(error, status){
				$scope.emailAddressErrorMessage = "Looks like there was a: " + status + " error";
				console.log('error');
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.email_form.submitted = true;
		}		
	};
}]);