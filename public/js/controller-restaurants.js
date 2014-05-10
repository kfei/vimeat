'use strict';

angular.module('vimEat.controllers').
controller('RestaurantsCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', function($rootScope, $scope, $http, $routeParams, $location) {
	// Phase 0: Initial formData object
	$scope.formData = {};

    // Phase 1: Get the list of restaurants
    $http({
        method  : 'GET',
        url     : '/restaurants',
        headers : { 'Content-Type': 'application/json' }
    })
    .success(function(data, status, headers, config) {
        $scope.restaurants = data.restaurants;
    });

    $scope.getInfo = function(id) {
    	$http({
			method  : 'GET',
			url     : '/restaurant/' + id,
			headers : { 'Content-Type': 'application/json' }
		})
		.success(function(data, status, headers, config) {
			$scope.formData = data;
		});
    }

	$scope.uploadFile = function(files, type) {
	    var fd = new FormData();
	    // Take the first selected file
	    fd.append("file", files[0]);
	    fd.append("type", type);

	    $http.post('/image', fd, {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    })
	    .success(function(data, status, headers, config) {
	    	$scope.formData.img = data;
	    });
	};

	$scope.deleteRestaurant = function(id) {
		$http({
			method  : 'DELETE',
			url     : '/restaurant/' + id,
			headers : { 'Content-Type': 'application/json' }
		})
		.success(function(data, status, headers, config) {
			$location.path('/show-restaurants');
		});
	};

	$scope.processForm = function() {
		if (!$scope.formData || !$scope.formData.name || !$scope.formData.creator) {
			$scope.errorOccured = true;
			return;
		}
		if(!$scope.formData.sleep) {
			$scope.formData.sleep = false;
		}
		if(!$scope.formData.img) {
			$scope.formData.img = '';
		}

		if(!$scope.formData.id) {
			// Create a new restaurant
			$http({
				method  : 'POST',
				url     : '/restaurants',
				data    : $scope.formData,
				headers : { 'Content-Type': 'application/json' }
			})
			.success(function(data, status, headers, config) {
	            if (false) {
		            // TODO: do error handling
		        } else {
		        	$location.path('/show-restaurants');
	            	// If successful, bind some success message to message
	                // $scope.message = data.message;
	            }
	        });
		} else {
			// Edit a restaurant
			$http({
				method  : 'POST',
				url     : '/restaurant/' + $scope.formData.id,
				data    : $scope.formData,
				headers : { 'Content-Type': 'application/json' }
			})
			.success(function(data, status, headers, config) {
	            if (false) {
		            // TODO: do error handling
		        } else {
		        	$location.path('/show-restaurants');
	        	}
	    	});
		}
	};

    function onFocus() {
        $scope.isFocus = true;
        $scope.$apply(function(){
            $rootScope.unRead = 0;
        });
    };

    function onBlur() {
        $scope.isFocus = false;
    };

    // check for Internet Explorer
    if (/*@cc_on!@*/false) {
        document.onfocusin = onFocus;
        document.onfocusout = onBlur;
    } else {
        window.onfocus = onFocus;
        window.onblur = onBlur;
    }

}]);
