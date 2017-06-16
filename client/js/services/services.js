'use strict';

var app = angular.module('myApp');


app.service('Business', function($http, $q) {

  this.search = input => {
    return $http.post('/api/businesses/search', input)
  }

  this.info = id => {
    return $http.get(`/api/businesses/${id}`)
    .then(res => {
      return $q.resolve(res.data)
    })
  }

})

app.service('User', function($http, $q) {


  this.getProfile = () => {
    return $http.get('/api/users/profile')
    .then(res => {
      return $q.resolve(res.data);
    })
  }

  this.addFavorite = businessObj => {
    return $http.post('/api/users/favorite', businessObj)
  }

  this.getFavorites = id => {
    return $http.get('/api/users/showFavorites/')
    .then(res => {
      return $q.resolve(res.data.favorites)
    })
  }

  this.unfavorite = id => {
    return $http.put(`/api/users/${id}`)
  }

  this.totalUsers = id => {
    return $http.get(`api/users/total/${id}`)
  }


})
