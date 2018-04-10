"use strict";

/**
 * Email navbar
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
	.directive('emailsNavbar', function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/navbar/navbar.html',
			controller: ['$scope', function emailsNavbarCtrl($scope) {
				
			}]
		}
	})