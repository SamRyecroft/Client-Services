'use strict';

var loginApp = angular.module('loginApp', ['ngResource', 'ngRoute', 'ngCookies']);

// === MAIN CONTROLLER === //
// ======================= //
// === MAIN CONTROLLER === //
loginApp.controller('MainController', ['$scope', '$http', '$cookies', 'LoginStatusFactory', 'LoggedInUserFactory', 'ProfileFactory', function($scope, $http, $cookies, LoginStatusFactory, LoggedInUserFactory, ProfileFactory){
	
	// Show popup variables.
	$scope.showPopup = false; // If true the contact form will show.
	$scope.submitted = false; // If true the error message will be able to be shown.
	$scope.contact = {}; // Holds the text that will be binded to and from the view

	// Loading indicators.
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.

	// Submit contact form function - Currently does not work on node.js server.
	$scope.contactSubmit = function(){
		if($scope.contact_form.$valid){ // If the frm input is valid, do the following.
			$scope.$emit('LOADING'); // Emit LOADING, which sets $scope.loading to true. Shows the loading indicator.
			$http({ // $http contact form post success, error promise.
				method: 'POST',
				url: '../../process.php',
				data: $.param($scope.contact),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
	
	// Clear contact form inputs by clicking the close button.
	$scope.clearInputs = function(){
		$scope.contact = '';
		$scope.contact_form.submitted = false;
	};

	// $scope.logOut is triggered by a ng-click from the drop down nav.
	$scope.logOut = function(){
		$http({ 	
			method: 'GET',
			url: 'https://localhost:3000/auth/logout',
			withCredentials: true
		}).success(function(data) {
			LoginStatusFactory.setLoginStatus(false); // Setting the login status to false to log the user out.
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



// === LOGIN CONTROLLER === //
// ======================== //
loginApp.controller('LoginController', ['$scope', '$http', '$cookies', '$timeout', '$location', 'LoginStatusFactory', 'LoggedInUserFactory', function($scope, $http, $cookies, $timeout, $location, LoginStatusFactory, LoggedInUserFactory){
	
	$scope.loginSubmit = function(){
		if($scope.login_form.$valid){
			$http({
				method: 'POST',
				url: 'https://localhost:3000/auth/login',
				data: $.param($scope.login)
			}).success(function(data){
				LoginStatusFactory.setLoginStatus(true);
				$scope.login = {};
				$timeout(function() {
					LoggedInUserFactory.setUser(angular.fromJson($cookies.userInfoCookie));
				}, 100);
				$location.path('/welcome');
			}).error(function(error, status){
				$scope.loginErrorMessage = "Oops. " + error.error;
				console.log(error, status, ' from Login');
			});
		}else{
			$scope.login_form.submitted = true;
		}
	};

}]);




// === WELCOME CONTROLLER === //
// ========================== //
loginApp.controller('WelcomeController', ['$scope', '$http', '$cookies', 'LoggedInUserFactory', 'ProfileFactory', 'LoginStatusFactory', 'UsersFactory', function($scope, $http, $cookies, LoggedInUserFactory, ProfileFactory, LoginStatusFactory, UsersFactory){
  
	$scope.showPage = LoginStatusFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.	
	
	
	// Loading indicators.
	$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
	$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.
	
	$scope.$emit('LOADING'); // Emit LOADING, sets $scope.loading to true. Shows loading indicator.
	$http({ 	
	    method: 'GET',
	    url: 'https://localhost:3000/accountResources/users'
	}).success(function(data) {
	    UsersFactory.setUsers(data);
	    $scope.members = UsersFactory.getUsers().userAccounts;
	    console.log('success from Welcome');
	    $scope.$emit('LOADED'); // Emit LOADED, sets $scope.loading to false. Hides loading indicator
	}).error(function(error, status) { 
	    console.log(error, status, 'error. Welcome.');
	});
	
	
	
	// Function called when user clicks a member in the welcome view.
	$scope.clickedMember = function(member){
		ProfileFactory.setUserProfile(member); // Passing the clicked member to the profile factory for the chosen member.
	};
	
	$scope.sortField = 'username'; // ng-click sets a different string to $scope.sortField to filter the list with orderBy
	
	$scope.reverse = false; // ng-click filters the list form A-Z and Z-A aplhabetically.
	
}]);




// === PROFILE CONTROLLER === //
// ========================== //
loginApp.controller('ProfileController', ['$scope', 'ProfileFactory', 'LoginStatusFactory', function($scope, ProfileFactory, LoginStatusFactory){
	
	$scope.showPage = LoginStatusFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	// Watches to get the current chosen member when changed in the /welcome view.
	$scope.$watch(ProfileFactory.getUserProfile, function () {
		$scope.profile = ProfileFactory.getUserProfile(); // Setting $scope.chosen to the current chosen members
			console.log($scope.profile);
	});
	
	$scope.likes = Math.floor((Math.random() * 10) + 1);
	$scope.addLike = function(){ // Adds 1 like per call to the chosen members' likes. 
		$scope.likes++;
	};
	
}]);




// === SETTINGS CONTROLLER === //
// =========================== //
loginApp.controller('SettingsController', ['$scope', 'LoginStatusFactory', 'LoggedInUserFactory', function($scope, LoginStatusFactory, LoggedInUserFactory){

	$scope.user = LoggedInUserFactory.getUser(); // Getting the logged in user and putting it in $scope.user
	
	$scope.showPage = LoginStatusFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.

	// Update email address.
	$scope.settingsEmail = function(){
		if($scope.email_form.$valid){ // If email form is valid do the following.		
			if($scope.user.emailAddress != $scope.change.emailAddress){
				$scope.user.emailAddress = $scope.change.emailAddress; // Set the users email to the new email
				$scope.successEmailAddressChange = 'Your Email has been changed';
			}else{ // Else the emails are the same.
				$scope.sameEmailAddressError = 'That is the email you are currently using';
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
loginApp.controller('RegisterController', ['$scope', '$http', 'LoginStatusFactory', function($scope, $http, LoginStatusFactory){
	
	$scope.showPage = LoginStatusFactory.getLoginStatus(); // If $scope.showPage = true the page is shown, if false it's not.
	
	// Register form submit function
	$scope.registerSubmit = function(){
		if($scope.register_form.$valid){ // If the form is valid do the following.
			$http({
				method: 'POST',
				url: 'https://localhost:3000/userAccount/accountTools/CreateNewAccount',
				data: $.param($scope.register),
				withCredentials: true
			}).success(function(data){
				$scope.registrationSuccessMessage = "Your account was created successfully";
				$scope.register = {};
			}).error(function(error, status){
				$scope.registrationErrorMessage = "Looks like there was a: " + status + " error";
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.register_form.submitted = true;
		}
	};

}]);



// === PASSWORD email CONTROLLER === //
// ================================= //
loginApp.controller('PasswordEmailController', ['$scope', '$http', function($scope, $http){
	// Retrieve password function.
	$scope.passwordEmailSubmit = function(){
		// Loading indicators.
		$scope.$on('LOADING', function(){$scope.loading = true}); // If $scope.loading is true/LOADING the loader will show.
		$scope.$on('LOADED', function(){$scope.loading = false}); // If $scope.loading is false/LOADED the loader will show.
		
		if($scope.email_form.$valid){
			$scope.$emit('LOADING');
			$http({
				method: 'GET',
				url: 'https://localhost:3000/userAccount/accountTools/accountRecovery/generateRecoveryKey',
				params: {emailAddress: $scope.password.emailAddress}
			}).success(function(data){
				$scope.emailAddressSuccessMessage = "We have sent you an email";
				$scope.password.emailAddress = {};
				console.log('success', $scope.password.emailAddress);
				$scope.$emit('LOADED'); // Emit LOADING, sets $scope.loading to true. Shows loading indicator.
			}).error(function(error, status){
				$scope.emailAddressErrorMessage = "Looks like there was a: " + status + " error";
				console.log('error');
				$scope.$emit('LOADED'); // Emit LOADING, sets $scope.loading to true. Shows loading indicator.
			});
		}else{ // Else the form input is not valid. Set submitted to true to show error messages.
			$scope.email_form.submitted = true;
		}		
	};
}]);



// === PASSWORD RESET CONTROLLER === //
// ================================= //
loginApp.controller('PasswordResetController', ['$scope', '$http', '$location', function($scope, $http, $location){
	
	// Retrieve password function.
	$scope.passwordResetSubmit = function(){
		if($scope.reset_form.$valid){ // If the form is valid do the following.
			$scope.recovery = $location.$$search.recoveryKey;
			$scope.email = $location.$$search.emailAddress;
			$http({
				method: 'POST',
				url: 'https://localhost:3000/userAccount/accountTools/accountRecovery/recoverAccountWithKey',
				data: $.param($scope.recovery, $scope.email, $scope.password),
				withCredentials: true
			}).success(function(data){
				$scope.resetSuccessMessage = "Your Password was reset successfully";
				console.log('success', $scope.recovery, $scope.email);
			}).error(function(error, status){
				$scope.resetErrorMessage = "Oops. Looks like there was a: " + status + " error";
				console.log('error');
			});
		}else{ // Else the form input is not valid. Set submitted to true (shows error messages).
			$scope.reset_form.submitted = true;
		}
	};
}]);