'use strict';

loginApp.controller('SettingsController', ['$scope', '$http', '$cookies', 'LoginStatusFactory', 'LoggedInUserFactory', function($scope, $http, $cookies, LoginStatusFactory, LoggedInUserFactory){

	var userCookie = $cookies.userInfoCookie;
  	if(userCookie != undefined) { $scope.showPage = true; }

	$scope.user = LoggedInUserFactory.getUser(); // Getting the logged in user and putting it in $scope.user

	// Update email address.
	$scope.settingsEmail = function(){
		if($scope.email_form.$valid){
			$http({
				method: 'PATCH',
				url: 'https://localhost:3000/userAccounts/profileUtilities/changeEmailAddress',
				data: $.param($scope.change)
			}).success(function(data){
				$scope.successEmailAddressChange = 'Your Email has been changed';
				$scope.sameEmailAddressError = '';
				$timeout(function() {
					LoggedInUserFactory.setUser(angular.fromJson($cookies.userInfoCookie));
					ProfileFactory.setUserProfile(angular.fromJson($cookies.userInfoCookie));
				}, 100);
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
		}else{
			$scope.email_form.submitted = true;
		}
	};

	// Update Password.
	$scope.settingsPassword = function(){
		if($scope.password_form.$valid){
			$http({
				method: 'PATCH',
				url: 'https://localhost:3000/userAccount/profileUtilities/changePassword',
				data: $.param($scope.change)
			}).success(function(data){
				$scope.successPassChange = 'Your Password has been changed';
				$scope.confirmPasswordError = '';
				console.log('success');
			}).error(function(error, status){
				$scope.confirmPasswordError = 'Your passwords do not match';
				$scope.successPassChange = '';
				console.log(error, status, 'error');
			});
		}else{
			$scope.password_form.submitted = true;
		}
	};

}]);