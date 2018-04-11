"use strict";

/**
 * Media upload
 * 
 */
angular.module('email.directives')
	.controller('mediaUpload', ['$scope', '$mdDialog', function($scope, $mdDialog) {
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}])
