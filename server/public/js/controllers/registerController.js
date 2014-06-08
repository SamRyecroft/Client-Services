'use strict';

loginApp.controller('RegisterController', ['$scope', '$http', 'memberFactory', 'loggedInFactory', function($scope, $http, memberFactory, loggedInFactory){
	
	/*
memberFactory.getMembers().
		success(function(data, status){
			$scope.members = data;
		}).
		error(function(error, status){
			console.log(error, status);
		});
*/
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	
	// Register form submit function
	$scope.registerSubmit = function(){
		if($scope.register_form.$valid){ // If the form is valid do the following.			    
			
			var d = $.param($scope.register);
				
				$http({
			        method  : 'POST',
			        url     : 'https://localhost:3000/userAccount/accountTools/CreateNewAccount',
			        data    : d,
			        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
			    }).success(function(data){
			    	console.log('success');
			    }).error(function(error, status){
			    	console.log(error, status, 'error');
			    });
			    /*
for (var i=0; i<$scope.members.length; i++) {
			 	// If a username that is in the members list is the same as the users destired username do the following.
				if ($scope.members[i].username == $scope.register.username) {
					$scope.registrationErrorMessage = "Select a different username"; // Set error message.
					$scope.registrationError = true; // When true the user account is not registered.
					break;
				}
			}
*/
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.register_form.submitted = true;
		}
		
		// If $scope.registrationError is false and the form is valid do the following, the registration is valid.
		/*
if (!$scope.registrationError && $scope.register_form.$valid){
			$scope.members.push( // Push the registration details to $scope.members
				{
					username:$scope.register.username, 
					fname:$scope.register.firstName, 
					lname:$scope.register.surname, 
					email:$scope.register.email,
					imgURL:'https://pbs.twimg.com/profile_images/466574846608949248/V3xkb-VP_400x400.png',
					likes: Math.floor(Math.random() * 100),
					password:$scope.register.password
				}
			);
			$scope.registrationSuccessMessage = "Your account was created successfully"; // Set a success message.
		}
*/
	};

}]);