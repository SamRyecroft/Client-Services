'use strict';

loginApp.controller('EditController', ['$scope', '$http', '$cookies', '$timeout', 'LoginStatusFactory', 'LoggedInUserFactory', 'ProfileFactory', function($scope, $http, $cookies, $timeout, LoginStatusFactory, LoggedInUserFactory, ProfileFactory){

	var userCookie = $cookies.userInfoCookie;
  	if(userCookie != undefined) { $scope.showPage = true; }

	$scope.user = LoggedInUserFactory.getUser(); // Getting the logged in user and putting it in $scope.user		

	// Function onChange for when an image file is added
	$scope.filesChanged = function(elm){
		$scope.files = elm.files; // $scope.files is set to the values of the element passed in (workaround for file ng-model) 
		$scope.$apply(); // Apply updates the scope when the file is added.
	};
	// Edit Image
	$scope.editImg = function(){
		if($scope.user.profileImage != $scope.files[0].name){ // If old image & new image are not the same change the image.
			$scope.user.profileImage = $scope.files[0].name;
			$scope.successImgChange = 'Your Image has been changed';
			$scope.sameImgError = '';
		}else{ // If the images are the same.
			$scope.sameImgError = 'That is the Image you currently have set';
			$scope.successImgChange = '';
		};
		console.log($scope.files);
	};

	// Edit name
	$scope.editName = function(){
		if($scope.name_form.$valid){ // If the form is valid do the following.
			if($scope.user.firstName != $scope.edit.firstName){
				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changeAccountHolderName',
					data: $.param($scope.edit)
				}).success(function(data){
					$scope.successNameChange = 'Your name has been changed';
					$scope.sameNameError = '';
					$timeout(function() {
						LoggedInUserFactory.setUser(angular.fromJson($cookies.userInfoCookie));
						ProfileFactory.setUserProfile(angular.fromJson($cookies.userInfoCookie));
					}, 100);
				}).error(function(error, status){
					console.log(error, status, 'error');
				});	
			}else{
				$scope.sameNameError = 'That is the name you are currently using';
				$scope.successNameChange = '';
			}
		}else{
			$scope.name_form.submitted = true;
		}
	};
	
	
	// Edit Profile Description
	$scope.editDescription = function(){
		if($scope.description_form.$valid){ // If the form is valid do the following.
			if($scope.user.profileDescription != $scope.edit.profileDescription){
				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changeProfileInfomation',
					data: $.param($scope.edit)
				}).success(function(data){
					$scope.successDescriptionChange = 'Your Description has been changed';
					$scope.sameDescriptionError = '';
					$timeout(function() {
						LoggedInUserFactory.setUser(angular.fromJson($cookies.userInfoCookie));
						ProfileFactory.setUserProfile(angular.fromJson($cookies.userInfoCookie));
					}, 100);
				}).error(function(error, status){
					console.log(error, status, 'success');
				});
			}else{
				$scope.sameDescriptionError = 'That is the description you currently have set';
				$scope.successDescriptionChange = '';
			}
		}else{
			$scope.website_form.submitted = true;
		}
	};
	
	
	// Edit website
	$scope.editWebsite = function(){
		if($scope.website_form.$valid){ // If the form is valid do the following.
			if($scope.user.websiteURL != $scope.edit.websiteURL){
				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changeWebsiteURL',
					data: $.param($scope.edit)
				}).success(function(data){
					$scope.successWebsiteURLChange = 'Your Website has been changed';
					$scope.sameWebsiteURLError = '';
					$timeout(function() {
						LoggedInUserFactory.setUser(angular.fromJson($cookies.userInfoCookie));
						ProfileFactory.setUserProfile(angular.fromJson($cookies.userInfoCookie));
					}, 100);
				}).error(function(error, status){
					console.log(error, status, 'success');
				});
			}else{
				$scope.sameWebsiteURLError = 'That is the Website you currently have set';
				$scope.successWebsiteURLChange = '';
			}
		}else{
			$scope.website_form.submitted = true;
		}
	};

}]);