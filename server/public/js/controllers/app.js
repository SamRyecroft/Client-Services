'use strict';

var loginApp = angular.module('loginApp', ['ngResource', 'ngRoute', 'ngCookies']);

// === MAIN CONTROLLER === //
loginApp.controller('MainController', ['$scope', '$http', '$cookies', 'LoginStatusFactory', 'LoggedInUserFactory', 'ProfileFactory', function($scope, $http, $cookies, LoginStatusFactory, LoggedInUserFactory, ProfileFactory){

	// Contact form variables
	$scope.showContactForm = false; // If true the contact form will show.
	$scope.submitted = false; // If true the error message will show.
	$scope.contact = {}; // Holds the contact form text for the input fields

  	// Loading Indicators
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true (LOADING) the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false (LOADED) the loader will show.

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
				$scope.contact = {};
				$scope.contact.success = 'Your message has been submitted';
				$scope.$emit('LOADED');
			}).error(function(error, status){
				$scope.$emit('LOADED');
				$scope.contact.error = 'Looks like there was a ' + status + ' error';
			});

		}else{

			$scope.contact_form.submitted = true;

		};

	};



	// Clearing contact form inputs.
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



	// Setting the logged in user to the userInfoCookie.
	$scope.$watch(LoginStatusFactory.getLoginStatus,function() {

		$scope.loggedInUser = angular.fromJson($cookies.userInfoCookie);

	});



	// Setting LoginStatusFactory if userInfoCookie is set or not.
	$scope.$watch(function() {

		if(angular.fromJson($cookies.userInfoCookie)){

			LoginStatusFactory.setLoginStatus(true);

		}else{

			LoginStatusFactory.setLoginStatus(false);

		}

	});



	// Watches to get the login status of a member to decide what nav to show.
	$scope.$watch(LoginStatusFactory.getLoginStatus, function() {

		$scope.loggedIn = LoginStatusFactory.getLoginStatus();

		if (!$scope.loggedIn){

			$scope.loggedOut = true;

		} else {

			$scope.loggedOut = false;

		}

	});



	// If true the drop down nav will be displayed.
	$scope.showDropNav = false;

}]);