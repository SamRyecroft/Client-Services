'use strict';

loginApp.controller('SocialController', ['$scope', '$http', '$location', function($scope, $http, $location){
	
	
	$scope.socialRegister = function(){
	
		if($scope.social_form.$valid){
		
			if($scope.social.newPassword != $scope.social.confirmPassword){
				$scope.passwordDuplicateError = "You're password do not match";
			}
		
			$scope.social.emailAddress = $location.$$search.emailAddress;
			$scope.social.firstName = $location.$$search.firstName;
			$scope.social.middleName = $location.$$search.middleName;
			$scope.social.surname = $location.$$search.surname;
			
			$http({ 	
				method: 'POST',
				url: 'https://localhost:3000/userAccount/accountTools/createNewAccountWithSocialMedia',
				data: $.param($scope.social)
			}).success(function(data) {
				console.log(data);
				$scope.successCreateAccount = "You account has been created";
				if (data){
					
					$scope.social = [];
				}
			}).error(function(error, status) { 
				console.log(error, status, 'error. Welcome.');
			});
	
		}else{
	
			$scope.social_form.submitted = true;
	
		}	
		
	}
	

}]);