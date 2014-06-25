'use strict';

loginApp.controller('UserController', ['$scope', '$cookies', function($scope, $cookies){
	
	// Assigning the userInfoCookie to the variable userCookie.
	var userCookie = angular.fromJson($cookies.userInfoCookie);
	
	// If the userInfoCookie is set. 
  	if(userCookie != undefined) {
  		
  		$scope.showPage = true; // $scope.showPage is true (page can be shown).
  		$scope.user = userCookie; // $scope.user gets the content of userCookie.
  		
  	};

}]);