'use strict';

loginApp.controller('PasswordResetController', ['$scope', '$http', function($scope, $http){
	// Retrieve password function.
	$scope.passwordResetSubmit = function(){
		if($scope.reset_form.$valid){ // If the form is valid do the following.	
			$scope.password.url = '';
			$http({
				method: 'POST',
				url: 'https://localhost:3000/accountActions/newPassword',
				data: $.param($scope.password),
				withCredentials: true
			}).success(function(data){
				$scope.resetSuccessMessage = "Your Password was reset successfully";
				console.log('success', $scope.password.url);
			}).error(function(error, status){
				$scope.resetErrorMessage = "Looks like there was a: " + status + " error";
				console.log('error');
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.reset_form.submitted = true;
		}
	};
}]);