'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', '$http', '$location', function($scope, $http, $location) {
  	// Phase 1: get the list of restaurants
  	$http({
			method  : 'GET',
			url     : '/restaurants',
			headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data, status, headers, config) {
            $scope.restaurants = data.restaurants;
    });
    // Phase 2: get the today object
  	$http({
			method  : 'GET',
			url     : '/today',
			headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data, status, headers, config) {
            $scope.today = data.today;
    });

    $scope.voteToday = function(index) {
    	$scope.today[index].vote++;
    	$scope.today[index].voters.push("kfei");
    };

	  
  }])
  .controller('MyCtrl2', ['$scope', '$http', '$location', function($scope, $http, $location) {
	  $scope.tmp = 'hello2';
	  $scope.rest = {};
	  
	  $scope.saveRestaurant = function(formData) {
		$scope.rest.name = formData.name;
		$scope.rest.creator = formData.creator;  
	  };
	  
	  $scope.processForm = function() {
	    $http({
			method  : 'POST',
			url     : '/restaurants/create',
			data    : $scope.formData,  // pass in data as strings
			headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data, status, headers, config) {
        	
            //console.log(data);

            if (false) {
            // 	// if not successful, bind errors to error variables
            //     $scope.errorName = data.errors.name;
            //     $scope.errorSuperhero = data.errors.superheroAlias;
            	$scope.rest.name = data;
            } else {
            	$location.path('/view1');
            // 	// if successful, bind success message to message
            //     $scope.message = data.message;
            }
        });
	  };
  }]);
