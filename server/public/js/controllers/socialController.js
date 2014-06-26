'use strict';

loginApp.controller('SocialController', ['$scope', '$http', function($scope, $http){
	
	
	$scope.socialRegister = function(){
	
		if($scope.social_form.$valid){
		
			if($scope.social.newPassword != $scope.social.confirmPassword){
				$scope.passwordDuplicateError = "You're password do not match";
			}
			
			console.log('Build functin');
	
		}else{
	
			$scope.social_form.submitted = true;
	
		}	
		
	}
	

}]);