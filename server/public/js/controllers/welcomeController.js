'use strict';

loginApp.controller('WelcomeController', ['$scope', '$http', '$cookies', '$timeout', 'profileFactory', 'loggedInFactory', function($scope, $http, $cookies, $timeout, profileFactory, loggedInFactory, memberFactory){
	
	// Loading indicators.
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.
	
	//$scope.$emit('LOADING'); // Emit LOADING, which sets $scope.loading to true. Shows the loading indicator.
	
	var cookie = $cookies.authenticationCookie;
	console.log(cookie);
	$http({ 	
		method: 'GET',
		url: 'https://localhost:3000/accountResources/users',
		withCredentials: true
	}).success(function(data) {
		$scope.members = data;
		console.log('success from Welcome', data, $scope.test);
		//$scope.$emit('LOADED'); // Emit LOADED, which sets $scope.loading to false. Hides the loading indicator
	}).error(function(error, status) { 
		console.log(error, status, 'error');
	});
		
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	// Function called when user clicks a member in the welcome view.
	$scope.clickedMember = function(member){
		profileFactory.setChosenMemb(member); // Passing the clicked member to the profile factory for the chosen member.
	};
	
	$scope.sortField = 'username'; // ng-click sets a different string to $scope.sortField to filter the list with orderBy
	
	$scope.reverse = false; // ng-click filters the list form A-Z and Z-A aplhabetically.
	
}]);