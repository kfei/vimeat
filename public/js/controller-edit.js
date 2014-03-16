'use strict';

angular.module('myApp.controllers').
controller('EditCtrl', ['$scope', '$http', '$location', '$routeParams', 'createDialog', function($scope, $http, $location, $routeParams, createDialog) {
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