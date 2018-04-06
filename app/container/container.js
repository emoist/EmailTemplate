"use strict";

/**
 * Email container
 * 
 */
angular.module('email.main')
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
			templateUrl: variables.containerPath + '/container.html',
			controller: 'emailsContainerCtrl',
			data: {
				requiresLogin: true
			}
		}).
		when('/emails', {
			templateUrl: variables.containerPath + '/container.html',
			controller: 'emailsContainerCtrl',
			data: {
				requiresLogin: true
			}
		}).
		when('/emails/:id', {
			templateUrl: variables.containerPath + '/container.html',
			controller: 'emailsContainerCtrl',
			data: {
				requiresLogin: true
			}
		})
	}])
	.controller('emailsContainerCtrl', ['$scope', '$location', '$http', 'store', 'jwtHelper', '$routeParams',
		function($scope, $location, $http, store, jwtHelper, $routeParams) {
			$scope.email_block = false;
			$scope.email_id = $routeParams.id;
			if (angular.isDefined($scope.email_id)) {
				$scope.email_block = true;
			}
            $scope.logout = function() {
                store.remove('jwt');
                $location.path('/');
            }
		}]);