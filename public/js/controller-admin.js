'use strict';

angular.module('vimEat.controllers').
controller('AdminCtrl',
	['$rootScope', '$scope', '$http', '$routeParams', '$location', '$sce', function($rootScope, $scope, $http, $routeParams, $location, $sce) {

    $scope.removeToday = function() {
        $http({
            method  : 'DELETE',
            url     : '/today',
            headers : { 'Content-Type': 'application/json' }
        })
        .success(function(data, status, headers, config) {
            $location.path('/');
        });
    };

    $scope.blackboxToday = function(id) {
        var fd = {};
        fd.id = id;

        $http({
            method  : 'POST',
            url     : '/today/blackbox',
            data    : fd,
            headers : { 'Content-Type': 'application/json' }
        })
        .success(function(data, status, headers, config) {
            $location.path('/');
        });
    };

    $scope.setWarningMessage = function(warnMsg) {
        // TODO
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
