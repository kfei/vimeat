'use strict';

// Declare app level module which depends on filters, and services
angular.module('vimEat', [
  'ngRoute',
  'ngAnimate',
  'vimEat.filters',
  'vimEat.services',
  'vimEat.directives',
  'vimEat.controllers',
  'fundoo.services'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/partial1.html', controller: 'HomeCtrl'});
  $routeProvider.when('/create', {templateUrl: 'partials/partial2.html', controller: 'CreateCtrl'});
  $routeProvider.when('/edit/:id', {templateUrl: 'partials/partial3.html', controller: 'EditCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
  // $locationProvider.html5Mode(true);
}]).
directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
