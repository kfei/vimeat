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
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/create-restaurant', {templateUrl: 'partials/create-restaurant.html', controller: 'CreateCtrl'});
  $routeProvider.when('/edit-restaurant/:id', {templateUrl: 'partials/edit-restaurant.html', controller: 'EditCtrl'});
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
