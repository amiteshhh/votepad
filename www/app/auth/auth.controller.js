(function () {
    'use strict';

    var moduleName = 'app.auth';

    angular.module(moduleName)
        .controller('AuthCtrl', AuthCtrl);

    AuthCtrl.$inject = ['$state', '$scope', '$stateParams', '$ionicModal', '$localStorage', '$http', '$injector', '$ionicLoading', '$timeout', '$rootScope', 'APP_CONFIG'];
    function AuthCtrl($state, $scope, $stateParams, $ionicModal, $localStorage, $http, $injector, $ionicLoading, $timeout, $rootScope, APP_CONFIG) {
        console.log("inside User Registration Controller");
        var vm = this;
        var AuthSvc = $injector.get('AuthSvc');

        vm.openSignInModal = openSignInModal;


        init();

        function init() {
            $rootScope.userType = $localStorage.userType = $localStorage.userType || 'host';
            if ($stateParams.explicitLogout || $localStorage.userInfo) {
                vm.openSignInModal();
            }
        }


        function openSignInModal() {
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
                $ionicLoading.hide();
                iqwerty.toast.Toast('Successfully Logged In !');
                transitionToNextState(data);

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

        /*vm.setLoginAsHost = function () {
            vm.host = true;
            vm.participant = false;
        };

        vm.setLoginAsParticipant = function () {
            vm.host = false;
            vm.participant = true;
        };*/

        vm.setUserType = function (userType) {
            $rootScope.userType = $localStorage.userType = userType;
        };

        function transitionToNextState(data) {
            //$rootScope.userType = $localStorage.userType = vm.host ? 'host' : 'participant';
            $rootScope.userInfo = $localStorage.userInfo = data;
            $state.go('app.dashboard');
        }

        function createUser() {
            AuthSvc.createUser(vm.signUpForm).then(function (data) {
                console.log("createUser: " + JSON.stringify(data));
                $rootScope.firstVisit = true;
                if (vm.validateOtpModal) {
                    vm.validateOtpModal.hide();
                }

                $ionicLoading.hide();
                iqwerty.toast.Toast('Successfully Registered !');
                transitionToNextState(data);

            }, handleServiceError);
        }

        vm.validateRegistration = function () {
            $ionicLoading.show();
            if (!APP_CONFIG.OTP_ENABLED) {
                createUser();
                return;
            }

            $http({
                method: 'GET',
                url: APP_CONFIG.OTPUrl + vm.signUpForm.mobile

                //saurbah bhaiya
                //url: 'https://www.cognalys.com/api/v1/otp/?app_id=1199d982fcd745c3a5d2bde&access_token=a4358cd8f369319284dfeb6764f17fe8a412185b&mobile=+91' + vm.signUpForm.mobile*/
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

                iqwerty.toast.Toast('OTP Sent');

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

        /*vm.validateOTP = function () {
            $state.go('app.createEvent');
        };*/

        vm.validateOTP = function () {

            $ionicLoading.show();
            console.log(vm.userOTP);

            // Simple GET request example:
            $http({
                method: 'GET',
                url: APP_CONFIG.OTP_VALIDATE_URL + vm.keymatch + '&otp=+1' + vm.userOTP

                //saurabh Bhaiya
                /*url: 'https://www.cognalys.com/api/v1/otp/confirm/?app_id=1199d982fcd745c3a5d2bde&access_token=a4358cd8f369319284dfeb6764f17fe8a412185b&keymatch=' + vm.keymatch + '&otp=+1' + vm.userOTP*/
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
                        vm.userOTP = '';
                        vm.validateOtpModal.hide();
                    }, 8000);
                    console.log("We are facing problem with validating your otp. Please try again later.");
                    return;
                }


                createUser();

                /*}, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("validateOTP errorCallback");
                });*/
            });
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
            //return;
        }

    }
})();