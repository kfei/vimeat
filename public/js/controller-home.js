'use strict';

angular.module('vimEat.controllers').
controller('HomeCtrl',
    ['$rootScope', '$scope', '$http', '$location', '$sce', function($rootScope, $scope, $http, $location, $sce) {

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

    $scope.getLunchReport = function() {
        var report = {};
        $scope.lunchReport = {};
        var column = config.ethercalc_lunch_column;
        var size = config.ethercalc_lunch_size;

        // Get cells from ethercalc
        $http({
            method  : 'GET',
            url     : $sce.trustAsResourceUrl(config.ethercalc_lunch_cells)
        })
        .success(function(data, status, headers, config) {
            for (var i = 2; i < size; i++) {
                if (data[column + i] && data[column + i]['datavalue'].length > 1) {
                    var key = data[column + i]['datavalue'];
                    if (report.hasOwnProperty(key)) {
                        report[key] += 1;
                    } else {
                        report[key] = 1;
                    }
                }
            }
            $scope.lunchReport = report;
        });
    };

    $scope.showReportFlag = false;
    $scope.showReport = function(column) {
        if (!$scope.showReportFlag) {
            $scope.getLunchReport();    
        }
        $scope.showReportFlag = !$scope.showReportFlag;
    };

    $scope.currentHigh = 0;
    $scope.showVotersFlag = false;
    $scope.showCommentBoxFlags = [false, false, false];
    $scope.speaking = [null, null, null];
    
    // Phase 1: get the today object
    $http({
        method  : 'GET',
        url     : '/today',
        headers : { 'Content-Type': 'application/json' }
    })
    .success(function(data, status, headers, config) {
        $scope.today = data.today;
        // Init comments, in order to catch new comments from websocket.
        for (var i = 0; i < 4; i++) {
            if (!$scope.today[i].comments) {
                $scope.today[i].comments = [];
            }
        }
        sortVote();
    });

    function onFocus() {
        $scope.isFocus = true;
        $scope.$apply(function(){
            $rootScope.unRead = 0;
        });
    };

    function onBlur() {
        $scope.isFocus = false;
    };

    if (/*@cc_on!@*/false) { // check for Internet Explorer
        document.onfocusin = onFocus;
        document.onfocusout = onBlur;
    } else {
        window.onfocus = onFocus;
        window.onblur = onBlur;
    }

    // Load config for ethercalc URL and add it as trusted
    $scope.ethercalc_lunch = $sce.trustAsResourceUrl(config.ethercalc_lunch)

    /******************************************************* Websocket ****************************************************/

    // Read from config.js
    var host = "ws://" + config.websocket_ip + ":" + config.websocket_port;

    function connect() {
        try {
            $rootScope.socket = new WebSocket(host);

            // addMessage("Socket State: " + socket.readyState);

            // socket.onopen = function() {
            //     addMessage("Socket Status: " + socket.readyState + " (open)");
            // }

            // socket.onclose = function() {
            //     addMessage("Socket Status: " + socket.readyState + " (closed)");
            // }

            $rootScope.socket.onmessage = function(msg) {
                addMessage(msg.data);
            }
        } catch(exception) {
            addMessage("Error: " + exception);
        }
    }

    if (!$rootScope.socket || $rootScope.socket.readyState != 1) {
        connect();
    } else {
        $rootScope.socket.onmessage = function(msg) {
            addMessage(msg.data);
        }
    }

    function addMessage(msg) {
        msg = JSON.parse(msg);
        var index = msg['index'];
        var comment = {};
        comment['msg'] = msg['msg'];        
        comment['ip'] = msg['ip'];

        // Use scope.$apply to ensure view updates right after model updates
        $scope.$apply(function(){
            $scope.today[index].comments.push(comment);
            if ($scope.isFocus == false) {
                $rootScope.unRead = $rootScope.unRead + 1;
            }
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
          $rootScope.socket.send(JSON.stringify(jsonMsg));
          // addMessage("Sent: " + msg)
        } catch(exception) {
          addMessage("Failed To Send")
        }
    }

    /******************************************************* Websocket ****************************************************/

}]);
