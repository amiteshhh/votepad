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


  function runBlock($rootScope, $state, $localStorage, $cordovaAppVersion, APP_CONFIG) {
    console.log('Index runBlock is called.');
    $rootScope.userInfo = $localStorage.userInfo;
    setupPush();
    populateAppInfo($cordovaAppVersion, $rootScope);
    setupSocket(APP_CONFIG);
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'auth') {
        return;
      }
      var isUserAuth = _isUserAuthenticated($localStorage);
      console.log('isUserAuth: ', isUserAuth);
      if (!isUserAuth) {
        if (toState.name !== 'auth') {
          event.preventDefault();
          $state.go('auth');
        }
      }
    });

  }

  function _isUserAuthenticated($localStorage) {
    return $localStorage.userInfo && $localStorage.userInfo.id;
  }

  function setupSocket(APP_CONFIG) {
    var socketBaseUrl = APP_CONFIG.SERVER_URL + APP_CONFIG.REST_ENDPOINT;
    io.sails.url = socketBaseUrl;
    window.socketInstance = io.sails.connect(socketBaseUrl);//expose global

    socketInstance.on('connect', function () {
      console.log('socket connected');
      //iqwerty.toast.Toast('Successfully connected to socket !!');
    });
  }

  function populateAppInfo($cordovaAppVersion, $rootScope) {
    if (typeof cordova === 'undefined') {//bypass for browser
      $rootScope.appName = 'Votepad';
      $rootScope.appVersion = '0.0.1';
      return;
    }
    $cordovaAppVersion.getVersionNumber().then(function (version) {
      $rootScope.appVersion = version;
    });
    $cordovaAppVersion.getAppName().then(function (name) {
      $rootScope.appName = name;
    });
  }

})();
