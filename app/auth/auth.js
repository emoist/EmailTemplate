"use strict";

/**
 * User Auth
 * 
 */
angular.module('email.auth', [])
	/**
     * You can upload custom images
     * This is a demo url, you can change with your own
     * At this url, will be send a POST request with 'upload' param, whem 'upload' is what you need to upload
     * You must return a status_code = 200 and put all information in 'data' like 'data.img_url', otherwise return status_txt with your error
     */
	.constant('variables', emailBuilderConfigurations)

	/**
     * Module configurations
     */
	.config(['$routeProvider', '$locationProvider', 'variables', function ($routeProvider, $locationProvider, variables) {
		$routeProvider.
		when('/login', {
			templateUrl: variables.authPath + '/login.html',
			controller: 'loginCtrl'
		}).
		when('/register', {
			templateUrl: variables.authPath + '/register.html',
			controller: 'registerCtrl'
		})
	}])

	.controller('loginCtrl', ['$scope', '$http', 'variables', 'store', '$location',
		function($scope, $http, variables, store, $location) {
            if (store.get('jwt')) $location.path('/emails')
            
            $scope.error = '';
			$scope.login = function() {
				if ($scope.loginForm.$valid == false) {
					return;
				}
				$http.post('/auth/login', $scope.user)
				.then(function(response) {
                    store.set('jwt', response.data.id_token);
                    $location.path('/emails')
				}, function(err) {
                    $scope.error = err.data;
				});
			}
		}])
	.controller('registerCtrl', ['$scope', '$http', 'variables', 'store', '$location',
		function($scope, $http, variables, store, $location) {
            if (store.get('jwt')) $location.path('/emails')

            $scope.error = '';
			$scope.register = function() {
				if ($scope.signupForm.$valid == false) {
					return;
				}
				$http.post('/auth/register', $scope.user)
				.then(function(response) {
                    store.set('jwt', response.data.id_token);
                    $location.path('/emails')
				}, function(err) {
                    $scope.error = err.data;
				});
			}
		}]);