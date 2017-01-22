(function () {
    'use strict';

    var moduleName = 'app.auth';

    angular.module(moduleName)
        .controller('AuthCtrl', AuthCtrl);

    AuthCtrl.$inject = ['$state', '$scope', '$ionicModal', '$localStorage', '$http', '$injector', '$ionicLoading', '$timeout', '$rootScope'];
    function AuthCtrl($state, $scope, $ionicModal, $localStorage, $http, $injector, $ionicLoading, $timeout, $rootScope) {
        console.log("inside User Registration Controller");
        var vm = this;
        var AuthSvc = $injector.get('AuthSvc');

        vm.openSignInModal = function () {
            $ionicModal.fromTemplateUrl('app/common/templates/signIn-modal-template.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                vm.signInModal = modal;
                modal.show();
            });
        };

        vm.closeSignInModal = function () {
            vm.signInForm = {};
            vm.host = vm.participant = false;
            vm.signInModal.hide();
            //vm.signInModal.remove();
        };

        vm.closeOtpModal = function () {
            vm.userOTP = '';
            vm.signUpForm = {};
            vm.validateOtpModal.hide();
            //vm.validateOtpModal.remove();
        };

        vm.signInUser = function () {
            $ionicLoading.show();

            AuthSvc.verifyUser(vm.signInForm).then(function (data) {
                console.log("verifyUser: " + JSON.stringify(data));
                vm.signInModal.hide();
                vm.signInForm = {};
                $rootScope.userType = $localStorage.userType = vm.host ? 'host' : 'participant';
                $rootScope.userInfo = $localStorage.userInfo = data;
                $ionicLoading.hide();
                if($rootScope.userType === 'host') {
                    $state.go('app.dashboard');
                } else if($rootScope.userType === 'participant') {
                    $state.go('app.event');
                };
                
            }, function handleServiceError(err) {

                console.log('Error occurred with service', err);
                $ionicLoading.hide();
                vm.userSignInFail = true;
                $timeout(function () {
                    vm.userSignInFail = false;
                }, 6000);
                console.log("User Login failed !");
            });
        };

        vm.setLoginAsHost = function () {
            vm.host = true;
            vm.participant = false;
        };

        vm.setLoginAsParticipant = function () {
            vm.host = false;
            vm.participant = true;
        };

        vm.xvalidateRegistration = function () {
            $ionicLoading.show();

            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://www.cognalys.com/api/v1/otp/?app_id=1199d982fcd745c3a5d2bde&access_token=a4358cd8f369319284dfeb6764f17fe8a412185b&mobile=+91' + vm.signUpForm.mobile
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("validateOTP success - " + JSON.stringify(response));

                if (response.data.status === 'failed') {
                    console.log('*************************');
                    $ionicLoading.hide();
                    vm.userRegFail = true;
                    $timeout(function () {
                        vm.userRegFail = false;
                    }, 5000);
                    return;
                }

                console.log("response.data.keymatch - " + response.data.keymatch);
                vm.keymatch = response.data.keymatch;

                $ionicModal.fromTemplateUrl('app/common/templates/validate-otp-modal-template.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    vm.validateOtpModal = modal;
                    modal.show();
                    $ionicLoading.hide();
                });

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("validateRegistration errorCallback");
            });
        };

        // vm.validateOTP = function () {
        vm.validateRegistration = function () {
            $ionicLoading.show();
            console.log(vm.userOTP);

            // Simple GET request example:
            /*$http({
                method: 'GET',
                url: 'https://www.cognalys.com/api/v1/otp/confirm/?app_id=1199d982fcd745c3a5d2bde&access_token=a4358cd8f369319284dfeb6764f17fe8a412185b&keymatch=' + vm.keymatch + '&otp=+1' + vm.userOTP
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("validateOTP success - " + JSON.stringify(response));

                if (response.data.status === 'failed') {
                    $ionicLoading.hide();
                    //vm.userRegFail
                    vm.otpValFail = true;
                    $timeout(function () {
                        vm.otpValFail = false;
                        vm.validateOtpModal.hide();
                    }, 5000);
                    console.log("We are facing problem with validating your otp. Please try again later.");
                    return;
                }*/

            AuthSvc.createUser(vm.signUpForm).then(function (data) {
                //$ionicLoading.hide();
                console.log("createUser: " + JSON.stringify(data));
                $rootScope.userType = $localStorage.userType = vm.host ? 'host' : 'participant';
                $rootScope.userInfo = $localStorage.userInfo = data;
                $ionicLoading.hide();
                if($rootScope.userType === 'host') {
                    $state.go('app.createEvent');
                } else if($rootScope.userType === 'participant') {
                    $state.go('app.event');
                };
            }, handleServiceError);

            /*}, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("validateOTP errorCallback");
            });*/
        };

        // Cleanup the modal when we're done with it!
        /*$scope.$on('$destroy', function () {
            vm.signInModal.remove();
            vm.validateOtpModal.remove();
        });*/

        function handleServiceError(err) {
            console.log('Error occurred with service', err);

            $ionicLoading.hide();
            vm.userRegFail = true;
            $timeout(function () {
                vm.userRegFail = false;
            }, 6000);
            console.log("User Registration failed !");
            /*$timeout(function () {
                vm.validateOtpModal.hide();
            }, 4000);*/

            //$rootScope.$broadcast('notify-service-error', err);
        }

    }
})();
