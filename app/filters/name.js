'use strict';

/**
 * This filter is used for extract template name from email template
 */
 angular.module('email.filters')
.filter('templateName', function () {
    return function (template) {
    	return template != "" ? JSON.parse(decodeURI(template)).name : ""
    };
})