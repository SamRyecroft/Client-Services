'use strict';

loginApp.controller('ProfileController', ['$scope', 'profileFactory', 'loggedInFactory', function($scope, profileFactory, loggedInFactory){
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	// Watches to get the current chosen member when changed in the /welcome view.
	$scope.$watch(profileFactory.getChosenMemb, function () {
		$scope.chosen = profileFactory.getChosenMemb(); // Setting $scope.chosen to the current chosen members
	});
	
	$scope.addLike = function(){ // Adds 1 like per call to the chosen members' likes.
		$scope.chosen.likes++;
	};
	
}]);