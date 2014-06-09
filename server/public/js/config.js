'use strict';

// === LOGIN APP ROUTE CONFIG === //
loginApp.config(function($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
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
	when('/password', {
		templateUrl: 'partials/password.html',
		controller: 'PasswordController'
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
	otherwise({
		redirectTo: '/login'
	});
});