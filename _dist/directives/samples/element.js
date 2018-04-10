"use strict";

/**
 * Sidebar sample list
 * 
 */
angular.module('email.directives')
	/**
     * You can upload custom images
     * This is a demo url, you can change with your own
     * At this url, will be send a POST request with 'upload' param, whem 'upload' is what you need to upload
     * You must return a status_code = 200 and put all information in 'data' like 'data.img_url', otherwise return status_txt with your error
     */
	.constant('variables', emailBuilderConfigurations)
	.directive('emailsSample', function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/samples/template.html',
			controller: ['$scope', '$http', '$rootScope', function emailsNavbarCtrl($scope, $http, $rootScope) {
				$scope.sample_templates = [];
				$rootScope.selectedTemplate = 0;

				/**
	             * Fetch email templates from server
	             */
				$scope.init = function() {
					$http.get('/emails/templates')
					.then(function(response) {
						$scope.sample_templates = response.data;
					}, function(err) {
						$scope.error = err.data;
					});
				}

				/**
				 * Select Template
				 */
				$scope.selectTemplate = function(id) {
					$rootScope.selectedTemplate = id;
				}

				$scope.init();
			}]
		}
	})