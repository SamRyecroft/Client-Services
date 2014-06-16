'use strict';

loginApp.controller('SettingsController', ['$scope', '$http', '$cookies', 'LoginStatusFactory', 'LoggedInUserFactory', function($scope, $http, $cookies, LoginStatusFactory, LoggedInUserFactory){

	var userCookie = $cookies.userInfoCookie;
  	if(userCookie != undefined) { $scope.showPage = true; }
	
	$scope.user = LoggedInUserFactory.getUser(); // Getting the logged in user and putting it in $scope.user
	
	// Update email address.
	$scope.settingsEmail = function(){
		if($scope.email_form.$valid){ // If email form is valid do the following.
			$http({
					method: 'POST',
					url: 'https://localhost:3000/',
					data: $.param($scope.change.emailAddress)
				}).success(function(data){
					$scope.successEmailAddressChange = 'Your Email has been changed';
					$scope.sameEmailAddressError = '';
					console.log('success');
				}).error(function(error, status){
					$scope.sameEmailAddressError = 'That is the email you are currently using';
					$scope.successEmailAddressChange = '';
					console.log(error, status, 'error');
				});
			/*
if($scope.user.emailAddress != $scope.change.emailAddress){
				$scope.user.emailAddress = $scope.change.emailAddress; // Set the users email to the new email
				$scope.successEmailAddressChange = 'Your Email has been changed';
			}else{ // Else the emails are the same.
				$scope.sameEmailAddressError = 'That is the email you are currently using';
			}
*/
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.email_form.submitted = true;
		}
	};
	
	// Update Password.
	$scope.settingsPassword = function(){
		if($scope.password_form.$valid){ // If password form is valid do the following.
			$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changePassword',
					data: $.param($scope.change.newPass, $scope.change.oldPass)
				}).success(function(data){
					$scope.successPassChange = 'Your Password has been changed';
					$scope.confirmPasswordError = '';
					console.log('success');
				}).error(function(error, status){
					$scope.confirmPasswordError = 'Your passwords do not match';
					$scope.successPassChange = '';
					console.log(error, status, 'error');
				});
			// If new password is not the same as old and the new and confirmed match change the users' password.
			/*
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
*/
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.password_form.submitted = true;
		}
	};
	
}]);