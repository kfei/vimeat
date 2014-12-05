'use strict';

// Declare app level module which depends on filters, and services
angular.module('vimEat', [
  'ngRoute',
  'ngAnimate',
  'vimEat.filters',
  'vimEat.services',
  'vimEat.directives',
  'vimEat.controllers'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/show-restaurants/', {templateUrl: 'partials/show-restaurants.html', controller: 'RestaurantsCtrl'});
  $routeProvider.when('/show-drinks/', {templateUrl: 'partials/show-drinks.html', controller: 'DrinksCtrl'});
  $routeProvider.when('/bank/', {templateUrl: 'partials/show-bank.html', controller: 'BankCtrl'});
  $routeProvider.when('/admin/', {templateUrl: 'partials/show-admin.html', controller: 'AdminCtrl'});
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
