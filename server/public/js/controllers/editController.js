'use strict';

loginApp.controller('EditController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){

	// Assigning the userInfoCookie to the variable userCookie.
	var userCookie = angular.fromJson($cookies.userInfoCookie);

	// If the userInfoCookie is set. 
  	if(userCookie != undefined) {
  		
  		$scope.showPage = true; // $scope.showPage is true (page can be shown).
  		$scope.user = userCookie; // $scope.user gets the content of userCookie.
  		
  	};



	// Function onChange for when an image file is added
	$scope.filesChanged = function(elm){

		$scope.files = elm.files; // $scope.files is set to the values of the element passed in (workaround for file ng-model) 
		$scope.$apply(); // Apply updates the scope when the file is added.

	};
	// Edit Image.
	$scope.editImg = function(){

		if($scope.user.profileImage != $scope.files[0].name){ // If images are not the same.

			$scope.user.profileImage = $scope.files[0].name;
			$scope.successImgChange = 'Your Image has been changed';
			$scope.sameImgError = '';

		}else{ // Else the images are the same.

			$scope.sameImgError = 'That is the Image you currently have set';
			$scope.successImgChange = '';

		};

	};



	// Edit name.
	$scope.editName = function(){

		if($scope.name_form.$valid){ // If the form is valid do the following.

			if($scope.user.firstName != $scope.edit.firstName){ // If names are not the same.

				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changeAccountHolderName',
					data: $.param($scope.edit)
				}).success(function(data){
					$scope.successNameChange = 'Your name has been changed';
					$scope.sameNameError = '';
				}).error(function(error, status){
					console.log(error, status, 'error');
				});	

			}else{ // Else the names are the same.

				$scope.sameNameError = 'That is the name you are currently using';
				$scope.successNameChange = '';

			}

		}else{ // Else the form is invalid.

			$scope.name_form.submitted = true;

		}

	};



	// Edit Profile Description
	$scope.editDescription = function(){

		if($scope.description_form.$valid){ // If the form is valid do the following.

			if($scope.user.profileDescription != $scope.edit.profileDescription){ // If profileDescriptions are not the same.

				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changeProfileInfomation',
					data: $.param($scope.edit)
				}).success(function(data){
					$scope.successDescriptionChange = 'Your Description has been changed';
					$scope.sameDescriptionError = '';
					$scope.user.profileDescription = $scope.edit.profileDescription;
					$scope.edit.profileDescription = '';
				}).error(function(error, status){
					console.log(error, status, 'error');
				});

			}else{ // Else the profileDescriptions are the same.

				$scope.sameDescriptionError = 'That is the description you currently have set';
				$scope.successDescriptionChange = '';

			}

		}else{ // Else the form is invalid.

			$scope.website_form.submitted = true;

		}

	};



	// Edit website
	$scope.editWebsite = function(){

		if($scope.website_form.$valid){ // If the form is valid do the following.

			if($scope.user.websiteURL != $scope.edit.websiteURL){ // If website URL's are not the same.

				$http({
					method: 'PATCH',
					url: 'https://localhost:3000/userAccount/profileUtilities/changeWebsiteURL',
					data: $.param($scope.edit)
				}).success(function(data){
					$scope.successWebsiteURLChange = 'Your Website has been changed';
					$scope.sameWebsiteURLError = '';
				}).error(function(error, status){
					console.log(error, status, 'error');
				});

			}else{ // Else the webite URL's are the same.

				$scope.sameWebsiteURLError = 'That is the Website you currently have set';
				$scope.successWebsiteURLChange = '';

			}

		}else{ // Else the form is invalid.

			$scope.website_form.submitted = true;

		}

	};

}]);