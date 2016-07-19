'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth) {
  console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logOut = () => {
    $auth.logout();
    $state.go('login');
  }

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        console.log('res:', res);
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };

  $scope.search = () => {
    $state.go('search', {term: $scope.input.term, location: $scope.input.location})
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
        console.log('err:', err);
      })
    }

    $scope.register = () => {
      if($scope.newUser.password !== $scope.newUser.password2) {
        $scope.newUser.password = null;
        $scope.newUser.password2 = null;
        alert('Passwords must match.  Try again.')
      } else {
        console.log('$scope.newUser', $scope.newUser)
        $auth.signup($scope.newUser)
        .then(res => {
          $auth.login($scope.newUser)
          .then(res => {
            $state.go('profile')
          })
        })
        .catch(err => {
          console.log('err:', err);
        })
      }
    }
});


app.controller('profileCtrl', function($scope, $state, User, CurrentUser) {
  console.log('profileCtrl!');

  $scope.user = CurrentUser;

  $scope.favorites = () => {
    $state.go('favorites', {userId: $scope.user._id})
  }

  $scope.showFavorites = id => {
    $state.go('showFavorites', {id: id})
  }

});

app.controller('searchCtrl', function($scope, $state, $stateParams, User, Business) {
  console.log('searchCtrl!');

  console.log($stateParams.term);
  console.log($stateParams.location);
  console.log($stateParams);

  Business.search($stateParams)
  .then(res => {
    $scope.businesses = res.data.businesses;
  })
  .catch(err => {
    console.log('err:', err);
  })

  $scope.info = id => {
    $state.go('show', {id: id})
  }

});

app.controller('showCtrl', function($scope,$stateParams, Business, User){
console.log('showCtrl!');
  Business.info($stateParams.id)
  .then(res => {
    $scope.business = res;
  })

  User.totalUsers($stateParams.id)
  .then(res => {
    $scope.total = res.data.length
  })

  $scope.favorite = businessObj => {
    swal(`Added ${businessObj.name} to favorites!` )
    User.addFavorite(businessObj)
    .then ( res => {
      console.log('Hello!');
      User.totalUsers($stateParams.id)
      .then(res => {
        $scope.total = res.data.length
      })
    }
    )
  }

})

app.controller('showFavoritesCtrl', function($scope, $stateParams, User, CurrentFavorites, Business, $state) {
  console.log('showFavoritesCtrl!');

  console.log('CurrentFavorites', CurrentFavorites);

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
      console.log('err:', err);
    })
  }

  // User.totalUsers($stateParams.id)
  // .then(res => {
  //   $scope.total = res.data.length
  // })

})
