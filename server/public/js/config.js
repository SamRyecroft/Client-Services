'use strict';

// === LOGIN APP ROUTE CONFIG === //
loginApp.config(function($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.patch = {
	    'Content-Type': 'application/json;charset=utf-8'
	}
	$routeProvider.
	when('/index', {
		templateUrl: 'partials/index.html',
		controller: 'MainController'
	}).
	when('/login', {
		templateUrl: 'partials/login.html',
		controller: 'LoginController'
	}).
	when('/register', {
		templateUrl: 'partials/register.html',
		controller: 'RegisterController'
	}).
	when('/welcome', {
		templateUrl: 'partials/welcome.html',
		controller: 'WelcomeController'
	}).
	when('/password-email', {
		templateUrl: 'partials/password-email.html',
		controller: 'PasswordEmailController'
	}).
	when('/password-reset', {
		templateUrl: 'partials/password-reset.html',
		controller: 'PasswordResetController'
	}).
	when('/user', {
		templateUrl: 'partials/user.html',
		controller: 'UserController'
	}).
	when('/profile', {
		templateUrl: 'partials/profile.html',
		controller: 'ProfileController'
	}).
	when('/settings', {
		templateUrl: 'partials/settings.html',
		controller: 'SettingsController'
	}).
	when('/edit', {
		templateUrl: 'partials/edit.html',
		controller: 'EditController'
	}).
	when('/social-register', {
		templateUrl: 'partials/social-register.html',
		controller: 'SocialController'
	}).
	otherwise({
		redirectTo: '/login'
	});
});