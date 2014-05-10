'use strict';

angular.module('vimEat.controllers').
controller('DrinksCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', function($rootScope, $scope, $http, $routeParams, $location) {
	// Phase 0: Initial formData object
	$scope.formData = {};

    // Phase 1: Get the list of drinks
    $http({
        method  : 'GET',
        url     : '/drinks',
        headers : { 'Content-Type': 'application/json' }
    })
    .success(function(data, status, headers, config) {
        $scope.drinks = data.drinks;
    });

    $scope.getInfo = function(id) {
    	$http({
			method  : 'GET',
			url     : '/drink/' + id,
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

	$scope.deleteDrink = function(id) {
		$http({
			method  : 'DELETE',
			url     : '/drink/' + id,
			headers : { 'Content-Type': 'application/json' }
		})
		.success(function(data, status, headers, config) {
			$location.path('/show-drinks');
		});
	};

	$scope.processForm = function() {
		if (!$scope.formData || !$scope.formData.name || !$scope.formData.creator || !$scope.formData.phone) {
			$scope.errorOccured = true;
			return;
		}

		if(!$scope.formData.id) {
			// Create a new drink
			$http({
				method  : 'POST',
				url     : '/drinks',
				data    : $scope.formData,
				headers : { 'Content-Type': 'application/json' }
			})
			.success(function(data, status, headers, config) {
	            if (false) {
		            // TODO: do error handling
		        } else {
		        	$location.path('/show-drinks');
	            	// If successful, bind some success message to message
	                // $scope.message = data.message;
	            }
	        });
		} else {
			// Edit a drink
			$http({
				method  : 'POST',
				url     : '/drink/' + $scope.formData.id,
				data    : $scope.formData,
				headers : { 'Content-Type': 'application/json' }
			})
			.success(function(data, status, headers, config) {
	            if (false) {
		            // TODO: do error handling
		        } else {
		        	$location.path('/show-drinks');
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
