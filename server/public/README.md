PREREQUISITE!!!!
================

The app requires a node.js server. The one i am using with this is by Sam Ryecroft. (NodeServer).

For this to work, get Sam's Node Server code and replace the contents of the Public folder only with the contents of this.


Angular-Login - This needs updating
===================================

AngularJS login, register and password retrieval.

==========
LOGIN VIEW
==========
This view is controlled by 'LoginController'.

The login view allows current members to enter a username and password, which is checked against being valid and that it matches ones already stored in the list of current members.

Input fileds will apply a green border when the text entered passes validation to indicate to the users their details pass validation.

If the details do not pass validation for some reason (not enough characters etc.) relevant error messages will be displayed.

If details are valid but do not match ones already stored, error messages will be displayed.

If all details are valid and have a match the welcome view will be loaded in, where the user can see a lis of current members.

=============
REGISTER VIEW
=============
This view is controlled by 'RegisterController'

The register view will allow new accounts to be made using a username, email and password, which if valid will allow users to log in on the login view.

If the details are valid and are not already present in the ones already stored the user will be directed to the login view.

If the details are not valid error messages will be displayed.

If the details are valid but they match ones already stored, error messages will be displayed.

============
WELCOME VIEW
============

This view is controlled by 'WelcomeController'

The welcome view will be what users see after a successful login.

This view will have a list of current members, which can be filtered by username, type or by using a text input to type a name.

The list of memebers uses images from social media accounts for users.

=======================
PASSWORD RETRIEVAL VIEW
=======================

This view is controlled by 'PasswordController'

The password retrieval view will aallow users to retrieve their assword using their username and email combination.

If the user provides the required details they will be displayed with the matching password to those details.

If the details entered are invalid error messages will be displayed.

==============
CONTROLLERS.JS
==============

================
LOGIN CONTROLLER
================

This controller handles the login process for the login view.

It firstly populates $scope.members with the list of members from the factory 'memberFactory' from factories.js

It then sets $scope.submitted to be false, which will be set to true if the login form is invalid.

Next is the $scope.loginSubmit = function() which is run when the user submits the form on the login page. This function firstly check if the form is passes validation. If it does pass validation it loops through $scope.members to see if the details entered have a match in the current members stored. If they do have a match the welcome view is loaded and the loop ended.

If there is not a match in the ones already stored a relevant error message is issued into $scope.loginError to displat=y to the user.

If it does not pass validation then $scope.submitted is set to true, which indicates there is a validation error and displays relevant messages to the user with the use of ng-show in the login view.

===================
REGISTER CONTROLLER
===================

This controller handles the register process for the register view.

It firstly populates $scope.members with the list of members from the factory 'memberFactory' from factories.js

It then sets $scope.submitted to be false, which will be set to true if the login form is invalid.

Next is the $scope.loginSubmit = function() which is run when the user submits the register form on the register page. This function firstly check if the form is passes validation. If it does pass validation it loops through $scope.members to see if the username entered is already present in the list of members already stored. If there is a match $scope.registrationError is set to true, which means the user will not be directed to the login page and $scope.registrationErrorMessage will be given a message to display to the user.

If it does not pass validation then $scope.register_form.submitted is set to true, which indicates there is a validation error and displays relevant messages to the user with the use of ng-show in the register view.

If $scope.registrationError is false and the username is not already taken the details entered are pushed to the list of current memebrs using $scope.members.push and the login view is loaded so the user can loin with the details they just entered.

==================
WELCOME CONTROLLER
==================

This controller handles the register process for the register view.

It firstly populates $scope.members with the list of members from the factory 'memberFactory' from factories.js

$scope.sortField defines how the user can filter the list of members in the view by editing the value of $scope.sortField.

$scope.reverse enables the sortField filter results to be displayed in opposite order once ng-clicked. (From A-Z to Z-A)

===================
PASSWORD CONTROLLER
===================

This controller handles the password retrieval process for the password view.

It firstly populates $scope.members with the list of members from the factory 'memberFactory' from factories.js

It then sets $scope.passwordRetriev to hold a string, which will later be changed to the password if the details entered are correct.

Next is the $scope.passwordSubmit = function() which is run when the user submits the password retrieval form on the passwrd page. This function firstly check if the form is passes validation. If it does pass validation it loops through $scope.members to see if the username and emailed entered to retrieve a password are already present in the list of current members. If there is a match $scope.passwordRetrieve is set to hold the password to display to the user in the view.

If it does not pass validation then $scope.password_form.submitted is set to true, which indicates there is a validation error and displays relevant messages to the user with the use of ng-show in the password view.

If the form is valid but the details are not present in the ist of current members $scope.passwordErrorMessage is set to hold a string to display to the user in the view.


============
FACTORIES.JS
============

==============
MEMBER FACTORY
==============

This factory returns the array list of current member details.

Create empty factory object var factory = {}; to be populated with the members array's.

Populate the empty factory object var factory = {}; with the members array's using .getMembers. which is a function that returns members.

The memberFactory returns the factory objectvar factory = {}; now populated with the members array.


=========
CONFIG.JS
=========

This handles the controllers and routing for the views.

It assigns controllers to views, which allows them to be used by the view without the need for adding it to the view directly.


===
CSS
===

=========
STYLE.CSS
=========

This is the main css file for the application.

=================
MEDIA-QUERIES.CSS
=================

The handles how the application will be displayed on different sized screens.
