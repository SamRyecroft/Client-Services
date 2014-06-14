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
		if($scope.contact_form.$valid){ // If the frm input is valid, do the following.
			$scope.$emit('LOADING'); // Emit LOADING, which sets $scope.loading to true. Shows the loading indicator.
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
			}).error(function(error, status){
				$scope.contact.error = 'Looks like there was a ' + status + ' error';
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.contact_form.submitted = true;
		};
		$scope.$emit('LOADED'); // Emit LOADED, which sets $scope.loading to false. Hides the loading indicator
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




// === LOGIN CONTROLLER === //
// ======================== //
loginApp.controller('LoginController', ['$scope', '$http', '$location', 'memberFactory', 'loggedInFactory', 'userFactory', function($scope, $http, $location, memberFactory, loggedInFactory, userFactory){

	// Getting current members from the memberFactory. Then suing the success, error promises.
	memberFactory.getMembers().
		success(function(data, status){
			$scope.members = data;
		}).
		error(function(error, status){
			console.log(error, status);
		});

	$scope.submitted = false; // If true the error message will be able to be shown.

	$scope.loginValid = false; // If true $scope.loginErrorMessage will not be used.
	
	// Log in submit funciton
	$scope.loginSubmit = function(){
		if($scope.login_form.$valid){ // If login_form is valid, do the following 
			/*	
				$http({
			        method  : 'POST',
			        url     : 'https://localhost:3000/login',
			        data    : $.param($scope.login),
			        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			    }).success(function(data){
			    	console.log('success');
			    }).error(function(error, status){
			    	console.log(error, status);
			    });
			*/			
			for (var i=0; i<$scope.members.length; i++){ // Loop through $scope.members
				// If the username and password do have a match
				if ($scope.members[i].username == $scope.login.username && $scope.members[i].password == $scope.login.password){
					loggedInFactory.setLoginStatus(true); // Set loggedInFactory to true
					$scope.loginValid = true; // Set loginValid to true.
					userFactory.setUser($scope.members[i]); // Set the current member to userFactory.setUser($scope.members[i])
					$location.path("/welcome"); // Direct the location to the /welcome view. 
					break;
				};
			};
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.login_form.submitted = true;
		}

		// If $scope.loginValid is false and the login_form is valid set $scope.loginErrorMessage.
		if(!$scope.loginValid && $scope.login_form.$valid){
			$scope.loginErrorMessage = "Login details are incorrect. Try again.";
		};	
	};

}]);




// === WELCOME CONTROLLER === //
// ========================== //
loginApp.controller('WelcomeController', ['$scope', 'memberFactory', 'profileFactory', 'loggedInFactory', function($scope, memberFactory, profileFactory, loggedInFactory){
	
	// Loading indicators.
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.
	
	$scope.$emit('LOADING'); // Emit LOADING, which sets $scope.loading to true. Shows the loading indicator.
	
	memberFactory.getMembers().success(function(data){
		$scope.members = data;
		$scope.$emit('LOADED'); // Emit LOADED, which sets $scope.loading to false. Hides the loading indicator
	});
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	// Function called when user clicks a member in the welcome view.
	$scope.clickedMember = function(member){
		profileFactory.setChosenMemb(member); // Passing the clicked member to the profile factory for the chosen member.
	};
	
	$scope.sortField = 'username'; // ng-click sets a different string to $scope.sortField to filter the list with orderBy
	
	$scope.reverse = false; // ng-click filters the list form A-Z and Z-A aplhabetically.
	
}]);




// === PROFILE CONTROLLER === //
// ========================== //
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




// === SETTINGS CONTROLLER === //
// =========================== //
loginApp.controller('SettingsController', ['$scope', 'loggedInFactory', 'userFactory', function($scope, loggedInFactory, userFactory){

	$scope.user = userFactory.getUser(); // Getting the logged in user and putting it in $scope.user
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.

	// Update email address.
	$scope.settingsEmail = function(){
		if($scope.email_form.$valid){ // If email form is valid do the following.		
			if($scope.user.email != $scope.change.mail){
				$scope.user.email = $scope.change.mail; // Set the users email to the new email
				$scope.successEmailChange = 'Your Email has been changed';
			}else{ // Else the emails are the same.
				$scope.sameEmailError = 'That is the email you are currently using';
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.email_form.submitted = true;
		}
	};
	
	// Update Password.
	$scope.settingsPassword = function(){
		if($scope.password_form.$valid){ // If password form is valid do the following.
			// If new password is not the same as old and the new and confirmed match change the users' password.
			if(($scope.change.oldPass == $scope.user.password) && ($scope.change.newPass == $scope.change.confirmPass)){
				$scope.user.password = $scope.change.confirmPass;
				$scope.successPassChange = 'Your Password has been changed';
			}else{
				if($scope.change.oldPass != $scope.user.password){ // If the old password is incorrect output a message.
					$scope.samePasswordError = 'Your original password is incorrect';
				};
				if($scope.change.newPass != $scope.change.confirmPass){ // If the new and confirm password don't match output a message
					$scope.confirmPasswordError = 'Your passwords do not match';
				};
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.password_form.submitted = true;
		}
		
	};
	
}]);




// === EDIT CONTROLLER === //
// ======================= //
loginApp.controller('EditController', ['$scope', 'loggedInFactory', 'userFactory', function($scope, loggedInFactory, userFactory){

	$scope.user = userFactory.getUser(); // Getting the logged in user and putting it in $scope.user

	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.

	
	// Edit name
	$scope.editName = function(){
		if($scope.name_form.$valid){ // If the form is valid do the following.
			if($scope.user.fname != $scope.edit.fnam){ // If old fname & new fname are not the same change the fname.
				$scope.user.fname = $scope.edit.fnam
				$scope.successFnameChange = 'Your First name has been changed';
			}else{ // If the fnames are the same.
				$scope.sameFnameError = 'That is the First name you currently use';
			};
			if($scope.user.lname != $scope.edit.lnam){ // If old lname & new lname are not the same change the lname.
				$scope.user.lname = $scope.edit.lnam
				$scope.successLnameChange = 'Your Surname name has been changed';
			}else{ // If the lnames are the same.
				$scope.sameLnameError = 'That is the Surname you currently use';
			};
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.name_form.submitted = true;
		}
	};
	
	// Edit username
	$scope.editUsername = function(){
		if($scope.username_form.$valid){ // If the form is valid do the following.
			if($scope.user.username != $scope.edit.uname){ // If old uname & new uname are not the same change the uname.
				$scope.user.username = $scope.edit.uname
				$scope.successUnameChange = 'Your Username has been changed';
			}else{ // If the unames are the same.
				$scope.sameUnameError = 'That is the Username you currently use';
			};
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.username_form.submitted = true;
		}
	};
	
	// Edit website
	$scope.editWebsite = function(){
		if($scope.website_form.$valid){ // If the form is valid do the following.
			if($scope.user.web != $scope.edit.website){ // If old website & new website are not the same change the website.
				$scope.user.web = $scope.edit.website
				$scope.successWebsiteChange = 'Your Website has been changed';
			}else{ // If the websites are the same.
				$scope.sameWebsiteError = 'That is the Website you currently have set';
			};
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.website_form.submitted = true;
		}
	};
	
	// Function onChange for when an image file is added
	$scope.filesChanged = function(elm){
		$scope.files = elm.files; // $scope.files is set to the values of the element passed in (workaround for file ng-model) 
		$scope.$apply(); // Apply updates the scope when the file is added.
		console.log($scope.files);
	};
	
	// Edit website
	$scope.editImg = function(){
		if($scope.user.imgURL != $scope.files[0].name){// If old image & new image are not the same change the image.
			$scope.user.imgURL = $scope.files[0].name;
			$scope.successImgChange = 'Your Image has been changed';
		}else{ // If the images are the same.
			$scope.sameImgError = 'That is the Image you currently have set';
		};
		console.log($scope.files);
	};
	
}]);



// === REGISTER CONTROLLER === //
// =========================== //
loginApp.controller('RegisterController', ['$scope', '$http', 'memberFactory', 'loggedInFactory', function($scope, $http, memberFactory, loggedInFactory){
	
	memberFactory.getMembers().
		success(function(data, status){
			$scope.members = data;
		}).
		error(function(error, status){
			console.log(error, status);
		});
	
	$scope.showPage = loggedInFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	
	// Register form submit function
	$scope.registerSubmit = function(){
		if($scope.register_form.$valid){ // If the form is valid do the following.			    
			for (var i=0; i<$scope.members.length; i++) {
			 	// If a username that is in the members list is the same as the users destired username do the following.
				if ($scope.members[i].username == $scope.register.username) {
					$scope.registrationErrorMessage = "Select a different username"; // Set error message.
					$scope.registrationError = true; // When true the user account is not registered.
					break;
				}
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.register_form.submitted = true;
		}
		
		// If $scope.registrationError is false and the form is valid do the following, the registration is valid.
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
	};

}]);




// === PASSWORD CONTROLLER === //
// =========================== //
loginApp.controller('PasswordController', ['$scope', 'memberFactory', function($scope, memberFactory){
	
	memberFactory.getMembers().
		success(function(data, status){
			$scope.members = data;
		}).
		error(function(error, status){
			console.log(error, status);
		});
	
	$scope.passwordRetrieve = "Forgot Password"; // When details are valid this will be set to the users' password.
	
	$scope.passwordAuth = false; // If true, the if statemenet at the bottom will not run.
	
	// Retrieve password function.
	$scope.passwordSubmit = function(){
		if($scope.password_form.$valid){ // If the form is valid do the following.	
			for (var i=0; i<$scope.members.length; i++) {
				// If the username and email entered are the same as ones in the list do the following.
				if ($scope.members[i].username == $scope.password.username && $scope.members[i].email == $scope.password.email) {
					$scope.passwordRetrieve = "Your Password Is: " + $scope.members[i].password; // Set the password
					$scope.passwordAuth = true; // Set password error to true, which will stop $scope.passwordErrorMessage being set.
					break;
				}
			}
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.password_form.submitted = true;
		}
		
		// If $scope.passwordAuth is false anf the form is valid.
		if (!$scope.passwordAuth && $scope.password_form.$valid){
			$scope.passwordErrorMessage = "Those details don't match any we have"; // Set an error message.
		}
		
		
	};
	
}]);