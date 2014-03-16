'use strict';

angular.module('myApp.controllers').
controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

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

    $scope.showVoters = function() {
    	$scope.showVotersFlag = !$scope.showVotersFlag;
    };

    $scope.showCommentBoxFlag = function(index) {
    	return $scope.showCommentBoxFlags[index];
    };

    $scope.showCommentBox = function(index) {
    	$scope.showCommentBoxFlags[index] = !$scope.showCommentBoxFlags[index];
    };

    $scope.submitComment = function(index) {
        var msg = $scope.speaking[index];
    	$scope.speaking[index] = null;
        if (msg != null) {
    	   send(index, msg);
        }
    };

    $scope.voteToday = function(index) {
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
            	// TODO: error handling
            } else {
            	$scope.today[index].vote++;
            	$scope.today[index].voters.push(data.voter);
            	sortVote();
            }
        });
	};

    $scope.currentHigh = 0;
    $scope.showVotersFlag = false;
    $scope.showCommentBoxFlags = [false, false, false];
    $scope.speaking = [null, null, null];

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
        // Init comments
        for (var i = 0; i < 3; i++) {
            $scope.today[i].comments = [];
        }
        sortVote();
    });

    // Websocket ==========================================================================================================

    var socket, host;
    host = "ws://localhost:3001";

    function connect() {
        try {
            socket = new WebSocket(host);

            // addMessage("Socket State: " + socket.readyState);

            // socket.onopen = function() {
            //     addMessage("Socket Status: " + socket.readyState + " (open)");
            // }

            // socket.onclose = function() {
            //     addMessage("Socket Status: " + socket.readyState + " (closed)");
            // }

            socket.onmessage = function(msg) {
                addMessage(msg.data);
            }
        } catch(exception) {
            addMessage("Error: " + exception);
        }
    }

    connect();

    function addMessage(msg) {
        msg = JSON.parse(msg);
        var index = msg['index'];
        var comment = {};
        comment['msg'] = msg['msg'];        
        comment['ip'] = msg['ip'];

        // Use scope.$apply to ensure view updates right after model updates
        $scope.$apply(function(){
            $scope.today[index].comments.push(comment);
        });
    }

    function send(index, msg) {
        if (msg == '') {
          return;
        }

        var jsonMsg = {
            "index": index,
            "msg": msg
        };

        try {
          socket.send(JSON.stringify(jsonMsg));
          // addMessage("Sent: " + msg)
        } catch(exception) {
          addMessage("Failed To Send")
        }
    }

    // Websocket ==========================================================================================================

}]);