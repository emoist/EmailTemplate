'use strict';

// Declare app level module which depends on views, and components
angular.module('email', [
	'ngRoute',
	'angular-jwt',
	'angular-storage',
	'email.list',
	'email.builder',
	'email.auth'
])
.config(['$locationProvider', 'jwtInterceptorProvider', '$routeProvider', '$httpProvider', function($locationProvider, jwtInterceptorProvider, $routeProvider, $httpProvider) {
	$routeProvider.otherwise({redirectTo: '/'});
	$locationProvider.hashPrefix('!');
}])
.run(function($rootScope, store, jwtHelper, $location) {
	$rootScope.$on('$routeChangeStart', function(e, to) {
		if (to.data && to.data.requiresLogin) {
			if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
				e.preventDefault();
				$location.path('/login');
			}
		}
	})
});