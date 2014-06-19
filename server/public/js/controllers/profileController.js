'use strict';

loginApp.controller('ProfileController', ['$scope', '$cookies', 'ProfileFactory', 'LoggedInUserFactory', function($scope, $cookies, ProfileFactory, LoggedInUserFactory){

	var userCookie = angular.fromJson($cookies.userInfoCookie);
  	if(userCookie != undefined) { $scope.showPage = true; };
  	  	
	// Watches to get the current chosen member when changed in the /welcome view.
	$scope.$watch(ProfileFactory.getUserProfile, function () {
		$scope.profile = ProfileFactory.getUserProfile(); // Setting $scope.chosen to the current chosen members
	});

	$scope.likes = Math.floor((Math.random() * 10) + 1);
	$scope.addLike = function(){ // Adds 1 like per call to the chosen members' likes. 
		$scope.likes++;
	};

}]);