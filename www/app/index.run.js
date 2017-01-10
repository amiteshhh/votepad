(function () {
  'use strict';

  var moduleName = 'app';

  angular.module(moduleName).run(runBlock);

  window.ionic.Platform.ready(function () {
    console.log('Ionic is ready!');
    angular.bootstrap(document, ['app']);
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  function setupPush() {
    if (!window.PushNotification) {
      return;
    }

  }


  function runBlock($rootScope, $state) {
    console.log('Index runBlock is called.');
    setupPush();
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'auth') {
        return;
      }
      var isUserAuth = _isUserAuthenticated();
      console.log('isUserAuth: ', isUserAuth);
      if (!isUserAuth) {
        if (toState.name !== 'auth') {
          event.preventDefault();
          $state.go('auth');
        }
      } else {
        console.log('User is authenticated!!');
      }
    });

  }

  function _isUserAuthenticated() {
    return true;//for now
  }

})();
