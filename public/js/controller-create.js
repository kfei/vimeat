'use strict';

angular.module('vimEat.controllers').
controller('CreateCtrl', ['$rootScope', '$scope', '$http', '$location', 'createDialog', function($rootScope, $scope, $http, $location, createDialog) {	  
	$scope.processForm = function() {
		if (!$scope.formData || !$scope.formData.name || !$scope.formData.creator) {
			$scope.errorOccured = true;
			return;
		}
		if(!$scope.formData.sleep) {
			$scope.formData.sleep = false;
		}

		$http({
			method  : 'POST',
			url     : '/restaurants',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/json' }
		})
		.success(function(data, status, headers, config) {

            //console.log(data);

            if (false) {
	            // do error handling
	        } else {
	        	$location.path('/');
            	// if successful, bind success message to message
                // $scope.message = data.message;
        }
    });
	};

	$scope.uploadFile = function(files) {
		if(!$scope.formData) {
			$scope.formData = {};
		}

	    var fd = new FormData();
	    // Take the first selected file
	    fd.append("file", files[0]);

	    $http.post('/image', fd, {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    })
	    .success(function(data, status, headers, config) {
	    	$scope.formData.img = files[0].name;
	    });

	    $scope.img = files[0].name;
	};

	$scope.todoModal = function() {
		createDialog('lib/todo.html',{
		   id : 'todoDialog',
		   title: '/* TODO: VimEat 0.3 ~ */',
		   backdrop: true
		});
	};

}]);
