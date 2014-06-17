'use strict';

var loginApp = angular.module('loginApp', ['ngResource', 'ngRoute', 'ngCookies']);

// === MAIN CONTROLLER === //
loginApp.controller('MainController', ['$scope', '$http', '$cookies', 'LoginStatusFactory', 'LoggedInUserFactory', 'ProfileFactory', function($scope, $http, $cookies, LoginStatusFactory, LoggedInUserFactory, ProfileFactory){

	// Contact form variables
	$scope.showPopup = false; // If true the contact form will show.
	$scope.submitted = false; // If true the error message will be able to be shown.
	$scope.contact = {}; // Holds the text that will be binded to and from the view

	// Loading indicators.
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.

	// Contact form submit function - Currently does not work on node.js server.
	$scope.contactSubmit = function(){
		if($scope.contact_form.$valid){
			$scope.$emit('LOADING');
			$http({
				method: 'POST',
				url: '../../process.php',
				data: $.param($scope.contact),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data){
				$scope.contact.success = 'Your message has been submitted';
				$scope.contact.name = '';
				$scope.contact.email = '';
				$scope.contact.message = '';
				$scope.$emit('LOADED');
			}).error(function(error, status){
				$scope.$emit('LOADED');
				$scope.contact.error = 'Looks like there was a ' + status + ' error';
			});
		}else{
			$scope.contact_form.submitted = true;
		};
	};

	// Clear contact form inputs by clicking the close form button.
	$scope.clearInputs = function(){
		$scope.contact = '';
		$scope.contact_form.submitted = false;
	};

	// $scope.logOut is triggered by a ng-click from the drop down nav.
	$scope.logOut = function(){
		$http({ 	
			method: 'GET',
			url: 'https://localhost:3000/auth/logout'
		}).success(function(data) {
			LoginStatusFactory.setLoginStatus(false); // Setting the login status to false to log the user out.
			LoggedInUserFactory.setUser([]); // Clearing the user from LoggedInUserFactory.
		}).error(function(error, status) { 
			console.log(error, status, 'error occured during logout.');
		});
	};

	// Watches to get the login status of a member to decide what nav to show.
	$scope.$watch(LoginStatusFactory.getLoginStatus, function() {
		$scope.loggedIn = LoginStatusFactory.getLoginStatus();
		if (!$scope.loggedIn){
			$scope.loggedOut = true;
		} else {
			$scope.loggedOut = false;
		}	
	});

	// Watches to get details for the logged in user. Displays name in the drop down navigation, and passes user to userProfile.
	$scope.$watch(LoggedInUserFactory.getUser, function() {
		$scope.loggedInUser = LoggedInUserFactory.getUser();	
	});

	// $scope.userProfile is triggered by a ng-click from the drop down nav.
	$scope.userProfile = function(loggedInUser){
		ProfileFactory.setUserProfile(loggedInUser); // Setting setUserProfile to the logged in user for the profile page.
	};

}]);