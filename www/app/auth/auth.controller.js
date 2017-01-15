(function () {
    'use strict';

    var moduleName = 'app.auth';

    angular.module(moduleName)
        .controller('AuthCtrl', AuthCtrl);

    AuthCtrl.$inject = ['$state', '$scope', '$ionicModal', '$localStorage', '$http'];
    function AuthCtrl($state, $scope, $ionicModal, $localStorage, $http) {
        console.log("inside Registraion Controller");
        var vm = this;

        $ionicModal.fromTemplateUrl('signIn-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.signInModal = modal;
        });

        $ionicModal.fromTemplateUrl('validate-otp-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.validateOtpModal = modal;
        });

        vm.signIn = function () {
            vm.signInModal.show();
        }

        vm.closeSignInModal = function () {
            vm.signInModal.hide();
        };

        vm.closeOtpModal = function () {
            vm.validateOtpModal.hide();
        }

        vm.signInUser = function () {
            $localStorage.signInInfo = vm.signinForm;
            $state.go('app.home');
        }

        vm.validateRegistration = function () {
            console.log("validateRegistration Mobile No - " + vm.mobileNo); // validate mobile number 10 digit for isd code etc..
            vm.validateOtpModal.show();
            /*// Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://www.cognalys.com/api/v1/otp/?app_id=1199d982fcd745c3a5d2bde&access_token=a4358cd8f369319284dfeb6764f17fe8a412185b&mobile=+91' + vm.mobileNo
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("validateOTP success - " + JSON.stringify(response));
                
                if(response.data.errors) {
                    alert(response.data.errors[500]);
                    return;
                }

                vm.validateOtpModal.show();
                console.log("response.data.keymatch - " + response.data.keymatch);
                vm.keymatch = response.data.keymatch;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("validateRegistration errorCallback");
            });*/            
        }

        vm.validateOTP = function () {
            console.log(vm.userOTP);
            $state.go('app.home');

            /*// Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://www.cognalys.com/api/v1/otp/confirm/?app_id=1199d982fcd745c3a5d2bde&access_token=a4358cd8f369319284dfeb6764f17fe8a412185b&keymatch=' + vm.keymatch + '&otp=+1' + vm.userOTP
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("validateOTP success - " + JSON.stringify(response));
                //alert to show mobile number is verified
                alert(response.data.message);
                $state.go('app.home');
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("validateOTP errorCallback");
            });*/
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            vm.signInModal.remove();
            vm.validateOtpModal.remove();
        });

    }
})();
