'use strict';

loginApp.controller('PasswordResetController', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){

	var userCookie = $cookies.userInfoCookie;
  	if(userCookie != undefined) { $scope.showPage = true; }
	
	// Retrieve password function.
	$scope.passwordResetSubmit = function(){
		if($scope.reset_form.$valid){ // If the form is valid do the following.
			if($scope.reset.newPassword == $scope.reset.confirmPassword){
				$scope.reset.recoveryKey = $location.$$search.recoveryKey;
				$scope.reset.emailAddress = $location.$$search.emailAddress;
				$http({
					method: 'POST',
					url: 'https://localhost:3000/userAccount/accountTools/accountRecovery/recoverAccountWithKey',
					data: $.param($scope.reset),
					withCredentials: true
				}).success(function(data){
					$scope.resetSuccessMessage = "Your Password was reset successfully";
					$scope.resetErrorMessage = "";
					console.log('success', $scope.reset.recovery, $scope.reset.email);
				}).error(function(error, status){
					$scope.resetErrorMessage = "Oops. Looks like there was a: " + status + " error";
					$scope.resetSuccessMessage = "";
					console.log(error, status, 'error');
				});
			}else{
				$scope.passwordMatch = 'The password do not match';
			}
			
		}else{ // Else the form input is not valid. Set submitted to true (shows error messages).
			$scope.reset_form.submitted = true;
		}
	};
}]);