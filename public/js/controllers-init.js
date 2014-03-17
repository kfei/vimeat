'use strict';

/* Init Controllers */

angular.module('myApp.controllers', [])
.run(function($rootScope) {
    $rootScope.unRead = 0;
    $rootScope.isFocus = true;
});