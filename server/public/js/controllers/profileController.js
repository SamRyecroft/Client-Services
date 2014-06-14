'use strict';

loginApp.controller('ProfileController', ['$scope', 'userFactory', 'ProfileFactory', 'loggedInFactory', function($scope, userFactory, ProfileFactory, loggedInFactory){
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	$scope.user = userFactory.getUser();
		console.log($scope.user);
	
	// Watches to get the current chosen member when changed in the /welcome view.
	$scope.$watch(ProfileFactory.getUserProfile, function () {
		$scope.chosen = ProfileFactory.getUserProfile(); // Setting $scope.chosen to the current chosen members
			console.log($scope.chosen);
	});
	
	$scope.likes = Math.floor((Math.random() * 10) + 1);
	$scope.addLike = function(){ // Adds 1 like per call to the chosen members' likes. 
		$scope.likes++;
	};
	
}]);