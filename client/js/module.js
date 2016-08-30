'use strict';

var app = angular.module('myApp', ['ui.router', 'satellizer']);

app.config(function($authProvider) {

    $authProvider.loginUrl = '/api/users/login'
    $authProvider.signupUrl = '/api/users/signup'

})


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home.html' })
    .state('login', { url: '/login', templateUrl: '/html/login.html', controller: 'loginCtrl' })
    .state('profile', { url: '/profile',
            templateUrl: '/html/profile.html',
            controller: 'profileCtrl',
            resolve: {
              CurrentUser: function(User) {
                return User.getProfile();
              }
            }
          })
    .state('showFavorites', { url: '/showFavorites/:id',
            templateUrl: '/html/showFavorites.html',
            controller: 'showFavoritesCtrl',
            resolve: {
              CurrentFavorites: function(User) {
                return User.getFavorites();
              }
            }
          })
    .state('search',
            { url: '/search/:term/:location',
            templateUrl: '/html/search.html',
            controller: 'searchCtrl' })
    .state('show', {url: '/show/:id',
                    templateUrl: '/html/show.html',
                    controller: 'showCtrl'
                  })
  $urlRouterProvider.otherwise('/');
});

app.filter('startFrom', function() {
  return function(input, start) {
    start = +start;
    return input.slice(start);
  }
})
