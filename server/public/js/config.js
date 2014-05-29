'use strict';

// === CONFIG MODULE (WILL BE PASSED INTO LOGINAPP MODULE USING DEPENDANCY INJECTION) ['ConfigModule'] === //
var ConfigModule = angular.module('ConfigModule', ['ngRoute']);

// === LOGIN APP ROUTE CONFIG === //
ConfigModule.config(function($routeProvider) {
	$routeProvider.
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
	otherwise({
		redirectTo: '/index'
	});
});