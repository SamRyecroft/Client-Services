'use strict';

loginApp.controller('SettingsController', ['$scope', '$http', '$cookies', '$location', 'LoginStatusFactory', function($scope, $http, $cookies, $location, LoginStatusFactory){
	
	// Assigning the userInfoCookie to the variable userCookie.
	var userCookie = angular.fromJson($cookies.userInfoCookie);
	
	// If the userInfoCookie is set. 
  	if(userCookie != undefined) {
  		
  		$scope.showPage = true; // $scope.showPage is true (page can be shown).
  		$scope.user = userCookie; // $scope.user gets the content of userCookie.
  		
  	};	



	// Update email address.
	$scope.settingsEmail = function(){
	
		if($scope.email_form.$valid){
			
			if($scope.user.emailAddress != $scope.change.emailAddress){
			
				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccounts/profileUtilities/changeEmailAddress',
					data: $.param($scope.change)
				}).success(function(data){
					$scope.successEmailChange = 'Your Email has been changed';
					$scope.sameEmailError = '';
					$scope.user.emailAddress = $scope.change.emailAddress;
					$scope.change.emailAddress = '';
				}).error(function(error, status){
					$scope.sameEmailError = error.error;
					$scope.successEmailChange = '';
					console.log(error, status, 'error');
				});	
				
			}else{
			
				$scope.sameEmailError = 'That is the email you are currently using';
				$scope.successEmailChange = '';
				
			}
			
		}else{
		
			$scope.email_form.submitted = true;
		
		}
		
	};
	
		
	
	// Update Password.
	$scope.settingsPassword = function(){
	
		if($scope.password_form.$valid){
		
			$scope.passwordDuplicateError = "";
			$scope.passwordConfirmError = "";
			
				if($scope.change.oldPassword == ($scope.change.newPassword || $scope.confirmPassword)){
				
					$scope.passwordDuplicateError = "You're already using that password";
					
				}
				
				else if($scope.change.newPassword != $scope.change.confirmPassword){
				
					$scope.passwordConfirmError = 'Your desired password did not match';
					
				}
				
				else{
				
					$http({
		  				method: 'PATCH',			
		  				url: 'https://localhost:3000/userAccount/profileUtilities/changePassword',
		  				data: $.param($scope.change)
		  			}).success(function(data){
			  			$scope.successPassChange = 'Your Password has been changed';
			  			$scope.confirmPasswordError = '';
			  			$scope.change = {};
			  			console.log('success');
		  			}).error(function(error, status){
		  				$scope.successPassChange = '';
		  				console.log(error, status, 'error');
		  			});
		  				
				}
  			
  		}else{
  			$scope.password_form.submitted = true;
  		}
  		
  	};  		
  	


	// Delete User.
	$scope.settingsDelete = function(){
	
		if($scope.delete_form.$valid){
		
			$http({
				method: 'PATCH',
				url: 'https://localhost:3000/userAccount/profileUtilities/closeAccount',
				data: $.param($scope.change)
			}).success(function(data){
				$scope.successDelete = 'Your Password has been changed';
				LoginStatusFactory.setLoginStatus(false);
				$location.path('/login');
			}).error(function(error, status){
				console.log(error, status, 'error');
			});
			
		}else{
		
			$scope.delete_form.submitted = true;
			
		}
		
	};

}]);