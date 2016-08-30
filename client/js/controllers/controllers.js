'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth) {


  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logOut = () => {
    $auth.logout();
    $state.go('login');
  }

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };

  $scope.search = () => {
    $state.go('search', {term: $scope.input.term, location: $scope.input.location})
    $scope.input = null;
  }

});

app.controller('loginCtrl', function($scope, $auth, $state) {
  console.log('loginCtrl!');

  $scope.userLogin = () => {
      $auth.login($scope.user)
      .then(res => {
        $state.go('profile')
      })
      .catch(err => {
        swal('Invalid Email or Password')
      })
    }

    $scope.register = () => {
      if($scope.newUser.password !== $scope.newUser.password2) {
        $scope.newUser.password = null;
        $scope.newUser.password2 = null;
        alert('Passwords must match.  Try again.')
      } else {
        $auth.signup($scope.newUser)
        .then(res => {
          $auth.login($scope.newUser)
          .then(res => {
            $state.go('profile')
          })
        })
        .catch(err => {
          swal('Make sure your password match')
        })
      }
    }
});


app.controller('profileCtrl', function($scope, $state, User, CurrentUser) {

  $scope.user = CurrentUser;

  $scope.favorites = () => {
    $state.go('favorites', {userId: $scope.user._id})
  }

  $scope.showFavorites = id => {
    $state.go('showFavorites', {id: id})
  }

});

app.controller('searchCtrl', function($scope, $state, $stateParams, User, Business) {


  Business.search($stateParams)
  .then(res => {
    $scope.businesses = res.data.businesses;
  })
  .catch(err => {
    console.log('err:', err);
  })

  $scope.currentPage = 0;
  $scope.pageSize = 5;
  $scope.numberOfPages = function () {
    return Math.ceil($scope.businesses.length/$scope.pageSize);

  }


  $scope.info = id => {
    $state.go('show', {id: id})
  }

});

app.controller('showCtrl', function($scope,$stateParams, Business, User){
  Business.info($stateParams.id)
  .then(res => {
    $scope.business = res;
  })

  User.totalUsers($stateParams.id)
  .then(res => {
    $scope.total = res.data.length
  })

  $scope.favorite = businessObj => {

    User.addFavorite(businessObj)
    .then ( res => {
      swal(`Added ${businessObj.name} to favorites!` )
      User.totalUsers($stateParams.id)
      .then(res => {
        $scope.total = res.data.length
      })
    })
    .catch(err => {
      swal("Already in favorites" )
    })
  }

})

app.controller('showFavoritesCtrl', function($scope, $stateParams, User, CurrentFavorites, Business, $state) {
  console.log('showFavoritesCtrl!');


  $scope.favorites = CurrentFavorites;

  $scope.info = id => {
    $state.go('show', {id: id})
  }

  $scope.unfavorite = (id, index) => {
    swal('Deleted from favorites' )
    User.unfavorite(id)
    .then(res => {

      $scope.favorites.splice(index, 1);
    })
    .catch(err => {
      swal('Already deleted')
    })
  }

  // User.totalUsers($stateParams.id)
  // .then(res => {
  //   $scope.total = res.data.length
  // })

})
