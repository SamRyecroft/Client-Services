'use strict';

loginApp.controller('ProfileController', ['$scope', '$cookies', 'ProfileFactory', function($scope, $cookies, ProfileFactory){
	
	// Assigning the userInfoCookie to the variable userCookie.
	var userCookie = angular.fromJson($cookies.userInfoCookie);
	
	// If the userInfoCookie is set, $scope.showPage is true (page can be shown).
  	if(userCookie != undefined) {
  	
  		$scope.showPage = true;
  	
  	};
  	
  	
  	
  	// Watches to get the current chosen member when changed in the /welcome view.
	$scope.$watch(ProfileFactory.getUserProfile, function () {
	
		$scope.profile = ProfileFactory.getUserProfile(); // Setting $scope.chosen to the current chosen members
		
	});
	
	

	$scope.likes = Math.floor((Math.random() * 10) + 1);
	$scope.addLike = function(){
	 
		$scope.likes++;
		
	};

}]);