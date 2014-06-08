'use strict';

var loginApp = angular.module('loginApp', ['ngResource', 'ConfigModule']);

// === MAIN CONTROLLER === //
// ======================= //
loginApp.controller('MainController', ['$scope', '$http', 'loggedInFactory', 'userFactory', 'profileFactory', function($scope, $http, loggedInFactory, userFactory, profileFactory){

	$scope.showPopup = false; // If true the contact form will show.
	$scope.submitted = false; // If true the error message will be able to be shown.
	$scope.contact = {}; // Holds the text that will be binded to anf from the view

	// Loading indicators.
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.
	// Submit contact form function.
	$scope.contactSubmit = function(){
		$scope.$emit('LOADING'); // Emit LOADING, which sets $scope.loading to true. Shows the loading indicator.
		if($scope.contact_form.$valid){ // If the frm input is valid, do the following.
			// $http contact form post success, error promise.
			$http({
				method : 'POST',
				url : 'process.php',
				data : $.param($scope.contact),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data){
				$scope.contact.success = 'Your message has been submitted';
				$scope.contact.name = '';
				$scope.contact.email = '';
				$scope.contact.message = '';
				$scope.$emit('LOADED'); // Emit LOADED, which sets $scope.loading to false. Hides the loading indicator
			}).error(function(error, status){
				$scope.contact.error = 'Looks like there was a ' + status + ' error';
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.contact_form.submitted = true;
		};
	};
	
	// Clear inputs for contact form. Called when the close form button is clicked.
	$scope.clearInputs = function(){
		$scope.contact.success = '';
		$scope.contact.name = '';
		$scope.contact.email = '';
		$scope.contact.message = '';
		$scope.contact_form.submitted = false;
	}

	// Watches to get the login status of a member to decide what nav to show.
	$scope.$watch(loggedInFactory.getLoginStatus, function() {
		$scope.loggedIn = loggedInFactory.getLoginStatus(); // Getting the login status	
		if (!$scope.loggedIn) $scope.loggedOut = true; // If !$scope.loggedIn user is logged out.
		else $scope.loggedOut = false;// Else $scope.loggedOut is false, user is logged in.
	});

	// Watches to get details for the logged in user to display  in the drop down navigation.
	$scope.$watch(userFactory.getUser, function() {
		$scope.welcome = userFactory.getUser(); // Getting the logged in user.
	});

	// $scope.userProfile is triggered by a ng-click from the drop down nav.
	$scope.userProfile = function(){
		profileFactory.setChosenMemb($scope.welcome); // Setting the chosen member to the logged in member
	};

	// $scope.logOut is triggered by a ng-click from the drop down nav.
	$scope.logOut = function(){
		loggedInFactory.setLoginStatus(false); // Setting the login status to false to log the user out.
	};

}]);