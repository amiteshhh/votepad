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


  function runBlock($rootScope, $state, $localStorage, APP_CONFIG) {
    console.log('Index runBlock is called.');
    $rootScope.userInfo = $localStorage.userInfo;
    setupPush();
    setupSocket(APP_CONFIG);
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

  function setupSocket(APP_CONFIG) {
    console.log('socket established');
    var socketBaseUrl = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT;
    io.sails.autoConnect = true;
    io.sails.url = socketBaseUrl;
    var socket = io.sails.connect(socketBaseUrl);
    //var socket = io.socket;
      socket.get('/event', function (resData, jwres) { console.log('socekt get', resData); });
    socket.get('/user', function (resData, jwres) { console.log('socekt get', resData); });

    socket.on('event', function (event) { console.log('event received socket', event); });
    socket.on('user', function (event) { console.log('user received socket', event); });
  }

})();
