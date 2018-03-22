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
     * This filter is used for extract template name from email template
     */
    .filter('templateName', function () {
        return function (template) {
        	return template != "" ? JSON.parse(decodeURI(template)).name : ""
        };
    })
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
			$scope.user_emails = {};

			/**
             * Fetch email templates from server
             */
			$scope.init = function() {
				$http.get('/emails')
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

			$scope.logout = function() {
				store.remove('jwt');
				$location.path('/');
			}

			$scope.init()
		}]);