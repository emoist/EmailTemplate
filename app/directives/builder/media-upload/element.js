"use strict";

/**
 * Media upload
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

	.controller('mediaUpload', ['$scope', '$mdDialog', '$http', 'variables', 'store', 'jwtHelper', function($scope, $mdDialog, $http, variables, store, jwtHelper) {
		$scope.selectedIndex = 1;
		$scope.galleries = [];
		$scope.currentGallery = {};

        var jwt = store.get('jwt');
        var user = jwt && jwtHelper.decodeToken(jwt);
        $scope.enableManage = user.role == 'designer' ? true : false;

		$scope.hide = function(data) {
			$mdDialog.hide(data);
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.hasItems = function() {
			return $scope.galleries.length > 0;
		}

		$scope.getGalleries = function() {
			$http.get('/galleries')
			.then(response => {
				$scope.galleries = response.data;
			})
		}

		$scope.galleryPath = function(gallery) {
			return angular.isUndefined(gallery.id) ? '' : variables.uploadsPath + gallery.name;
		}

		$scope.setCurrentGallery = function(gallery) {
			$scope.currentGallery = gallery;
		}

		$scope.removeCurrentGallery = function() {
			$http.delete('/galleries/' + $scope.currentGallery.id)
			.then(response => {
				angular.forEach($scope.galleries, function(value, key) {
					if (value.id == $scope.currentGallery.id)
						$scope.galleries.splice(key, 1)
				})
				$scope.currentGallery = {}
			})
		}

		$scope.selectCurrentGallery = function() {
			$scope.hide($scope.currentGallery)
		}

		$scope.isDisabledCurrentGallery = function() {
			return angular.isUndefined($scope.currentGallery.id);
		}

		$scope.getGalleries();

		$scope.dzOptions = {
			url : '/upload',
			acceptedFiles : 'image/jpeg, images/jpg, image/png',
			dictDefaultMessage : 'Click to add or drop photos (10 max)',
			dictResponseError : 'Could not upload this photo',
			paramName : 'photo',
			maxFilesize : '10',
			maxFiles : '10'
		};

		$scope.dzCallbacks = {
			'success': function(file, xhr) {
				$scope.galleries.push(xhr);
			}
		};
		$scope.dzMethods = {};
	}])
