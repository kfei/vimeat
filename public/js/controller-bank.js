'use strict';

angular.module('vimEat.controllers').
controller('BankCtrl',
	['$rootScope', '$scope', '$http', '$routeParams', '$location', '$sce', function($rootScope, $scope, $http, $routeParams, $location, $sce) {
	// Load config for ethercalc URL and add it as trusted
    $scope.ethercalc_bank = $sce.trustAsResourceUrl(config.ethercalc_bank)

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
