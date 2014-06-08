'use strict';

loginApp.controller('SettingsController', ['$scope', 'loggedInFactory', 'userFactory', function($scope, loggedInFactory, userFactory){

	$scope.user = userFactory.getUser(); // Getting the logged in user and putting it in $scope.user
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.

	// Update email address.
	$scope.settingsEmail = function(){
		if($scope.email_form.$valid){ // If email form is valid do the following.		
			if($scope.user.email != $scope.change.mail){
				$scope.user.email = $scope.change.mail; // Set the users email to the new email
				$scope.successEmailChange = 'Your Email has been changed';
			}else{ // Else the emails are the same.
				$scope.sameEmailError = 'That is the email you are currently using';
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.email_form.submitted = true;
		}
	};
	
	// Update Password.
	$scope.settingsPassword = function(){
		if($scope.password_form.$valid){ // If password form is valid do the following.
			// If new password is not the same as old and the new and confirmed match change the users' password.
			if(($scope.change.oldPass == $scope.user.password) && ($scope.change.newPass == $scope.change.confirmPass)){
				$scope.user.password = $scope.change.confirmPass;
				$scope.successPassChange = 'Your Password has been changed';
			}else{
				if($scope.change.oldPass != $scope.user.password){ // If the old password is incorrect output a message.
					$scope.samePasswordError = 'Your original password is incorrect';
				};
				if($scope.change.newPass != $scope.change.confirmPass){ // If the new and confirm password don't match output a message
					$scope.confirmPasswordError = 'Your passwords do not match';
				};
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.password_form.submitted = true;
		}
		
	};
	
}]);