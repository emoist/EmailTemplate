"use strict";

/**
 * User Auth
 * 
 */
angular.module('email.list', [])
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
		when('/', {
			templateUrl: variables.listPath + '/list.html',
			controller: 'emailsCtrl',
			data: {
				requiresLogin: true
			}
		}).
		when('/emails', {
			templateUrl: variables.listPath + '/list.html',
			controller: 'emailsCtrl',
			data: {
				requiresLogin: true
			}
		})
	}])
	.controller('emailsCtrl', ['$scope', '$location', '$http', 'store', 'jwtHelper',
		function($scope, $location, $http, store, jwtHelper) {
			$scope.emails = [];

			$scope.jwt = store.get('jwt');
			$scope.user = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

			$http.post('/emails', {user_id: $scope.user.id})
			.then(function(response) {
				$scope.emails = response.data
			}, function(err) {
				$scope.error = err.data;
			});

			$scope.logout = function() {
				store.remove('jwt');
				$location.path('/');
			}
		}]);