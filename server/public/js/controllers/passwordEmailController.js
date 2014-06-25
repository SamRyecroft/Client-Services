'use strict';

loginApp.controller('PasswordEmailController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){

	// Retrieve password function.
	$scope.passwordEmailSubmit = function(){

  		// Loading Indicators
		$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true (LOADING) the loader will show.
		$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false (LOADED) the loader will show.

		if($scope.email_form.$valid){ // If the form is valid
		
			$scope.$emit('LOADING');
			$http({
				method: 'GET',
				url: 'https://localhost:3000/userAccount/accountTools/accountRecovery/generateRecoveryKey',
				params: {emailAddress: $scope.password.emailAddress}
			}).success(function(data){
				$scope.emailAddressSuccessMessage = "We have sent you an email";
				$scope.emailAddressErrorMessage = "";
				$scope.password.emailAddress = {};
				$scope.$emit('LOADED'); // Emit LOADING, sets $scope.loading to true. Shows loading indicator.
			}).error(function(error, status){
				$scope.emailAddressErrorMessage = error.error;
				$scope.emailAddressSuccessMessage = "";
				console.log(error, status, 'error');
				$scope.$emit('LOADED'); // Emit LOADING, sets $scope.loading to true. Shows loading indicator.
			});
			
		}else{ // Else the form is invalid
		
			$scope.email_form.submitted = true;
			
		}
		
	};

}]);