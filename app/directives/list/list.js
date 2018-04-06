"use strict";

/**
 * Email list
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

	.directive('emailsList', function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/list/list.html',
			controller: ['$scope', '$http', 'store', 'jwtHelper', function emailsListCtrl($scope, $http, store, jwtHelper) {
				$scope.user_emails = {};
				/**
	             * Fetch email templates from server
	             */
				$scope.init = function() {
					$http.get('/emails/non_templates')
					.then(function(response) {
						$scope.filterEmails(response.data)
					}, function(err) {
						$scope.error = err.data;
					});
				}

				/**
	             * Separate emails by user
	             */
				$scope.filterEmails = function(emails) {
			        var jwt = store.get('jwt');
			        var user = jwt && jwtHelper.decodeToken(jwt);
			        var current_username = user.fName + ' ' + user.lName;

					var user_emails = {}, email, user_name;
					for (var i = 0; i < emails.length; i++) {
						email = emails[i]
						if (!user_emails[email.user_id]) {
							user_name = email.fName + ' ' + email.lName
							if (user_name == current_username && user.id == email.user_id) user_name = 'My'
							user_emails[email.user_id] = { name: user_name, emails: [] }
						}
						user_emails[email.user_id].emails.push(email)
					}

					$scope.user_emails = angular.copy(user_emails)
				}

				$scope.init()
			}]
		}
	})