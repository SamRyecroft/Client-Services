'use strict';

loginApp.controller('WelcomeController', ['$scope', '$http', '$cookies', 'LoggedInUserFactory', 'ProfileFactory', 'LoginStatusFactory', 'UsersFactory', function($scope, $http, $cookies, LoggedInUserFactory, ProfileFactory, LoginStatusFactory, UsersFactory){

	var userCookie = angular.fromJson($cookies.userInfoCookie);
  	if(userCookie != undefined) { $scope.showPage = true; }

	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.

	$scope.$emit('LOADING'); // Emit LOADING, sets $scope.loading to true. Shows loading indicator.
	$http({ 	
	    method: 'GET',
	    url: 'https://localhost:3000/accountResources/users'
	}).success(function(data) {
	    UsersFactory.setUsers(data);
	    $scope.members = UsersFactory.getUsers().userAccounts;
	    $scope.$emit('LOADED'); // Emit LOADED, sets $scope.loading to false. Hides loading indicator
	}).error(function(error, status) { 
	    console.log(error, status, 'error. Welcome.');
	});

	// Function called when user clicks a member in the welcome view.
	$scope.clickedMember = function(member){
		ProfileFactory.setUserProfile(member); // Passing the clicked member to the profile factory for the chosen member.
	};

	$scope.sortField = 'username'; // ng-click sets a different string to $scope.sortField to filter the list with orderBy
	
	$scope.reverse = false; // ng-click filters the team list form A-Z and Z-A.

}]);