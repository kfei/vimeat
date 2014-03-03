'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.currentHigh = 0;
  	// Phase 1: get the list of restaurants
  	$http({
  		method  : 'GET',
  		url     : '/restaurants',
  		headers : { 'Content-Type': 'application/json' }
  	})
  	.success(function(data, status, headers, config) {
  		$scope.restaurants = data.restaurants;
  	});
    // Phase 2: get the today object
    $http({
    	method  : 'GET',
    	url     : '/today',
    	headers : { 'Content-Type': 'application/json' }
    })
    .success(function(data, status, headers, config) {
    	$scope.today = data.today;
    	sortVote();
    });

    function sortVote() {
    	$scope.currentHigh = 0;
    	for (var i = 0; i < 3; i++) {
    		if ($scope.today[i].vote > $scope.currentHigh) {
    			$scope.currentHigh = $scope.today[i].vote;
    		}
    	}
    	if ($scope.currentHigh == 0) {
    		$scope.currentHigh = 999;
    	}
    }

    $scope.voteToday = function(index) {
		// Post to server
		var postData = {};
		postData['index'] = index;
		$http({
			method  : 'POST',
			url     : '/today',
			data    : postData,
			headers : { 'Content-Type': 'application/json' }
		})
		.success(function(data, status, headers, config) {
			if (data.result != 0) {
            	// do error handling
            } else {
            	// Math.random().toString(36).replace(/[^a-z]+/g, '')
            	$scope.today[index].vote++;
            	$scope.today[index].voters.push(data.voter);
            	sortVote();
            }
        });
	};

}])
.controller('CreateCtrl', ['$scope', '$http', '$location', 'createDialog', function($scope, $http, $location, createDialog) {	  
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
            // 	// if successful, bind success message to message
            //     $scope.message = data.message;
        }
    });
	};

	$scope.uploadFile = function(files) {
	    var fd = new FormData();
	    //Take the first selected file
	    fd.append("file", files[0]);

	    $http.post('/image', fd, {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    });
	};

	$scope.todoModal = function() {
		createDialog('lib/todo.html',{
		   id : 'todoDialog',
		   title: '/* TODO: VimEat 0.2 ~ */',
		   backdrop: true
		});
	};

}])
.controller('EditCtrl', ['$scope', '$http', '$location', '$routeParams', 'createDialog', function($scope, $http, $location, $routeParams, createDialog) {
	// Get the restaurants which is to be edited
	$http({
		method  : 'GET',
		url     : '/restaurant/' + $routeParams.id,
		headers : { 'Content-Type': 'application/json' }
	})
	.success(function(data, status, headers, config) {
		$scope.formData = data;
	});

	$scope.todoModal = function() {
		createDialog('lib/todo.html',{
		   id : 'todoDialog',
		   title: '/* TODO: VimEat 0.2 ~ */',
		   backdrop: true
		});
	};

	$scope.deleteRestaurant = function (id) {
		$http({
			method  : 'DELETE',
			url     : '/restaurant/' + $routeParams.id,
			headers : { 'Content-Type': 'application/json' }
		})
		.success(function(data, status, headers, config) {
			$location.path('/');
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

	  	$http({
	  		method  : 'POST',
	  		url     : '/restaurant/' + $routeParams.id,
	  		data    : $scope.formData,
	  		headers : { 'Content-Type': 'application/json' }
	  	})
	  	.success(function(data, status, headers, config) {

            //console.log(data);

            if (false) {
	            // do error handling
	        } else {
	        	$location.path('/');
            // 	// if successful, bind success message to message
            //     $scope.message = data.message;
        }
    });
	  };
	}]);
