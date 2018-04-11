'use strict';

angular.module('email.auth', []);
angular.module('email.main', []);
angular.module('email.directives', []);
angular.module('email.filters', []);

// Declare app level module which depends on views, and components
angular.module('email', [
	'ngRoute',
	'ngMaterial',
	'ngAnimate',
	'ngAria',
	'ngMessages',
	'angular-jwt',
	'thatisuday.dropzone',
	'angular-storage',
	'email.auth',
	'email.main',
	'email.directives',
	'email.filters'
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
				store.remove('jwt');
				$location.path('/login');
			}
		}
	})
});