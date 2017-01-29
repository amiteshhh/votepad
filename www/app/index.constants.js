(function () {
    'use strict';

    var moduleName = 'app';

    angular.module(moduleName)
        .value('APP_CONFIG', {
            //SERVER_URL: 'http://localhost:1337',
            SERVER_URL: 'https://votepadserver.herokuapp.com',
            REST_ENDPOINT: '',
            OTP_ENABLED: false,
            OTP_URL:'https://www.cognalys.com/api/v1/otp/?app_id=ab2e8e8a22684b6f92b003e&access_token=8e359af247db3d466ee5fdbce2b841bcc180d457&mobile=+91',
            OTP_VALIDATE_URL: 'https://www.cognalys.com/api/v1/otp/confirm/?app_id=ab2e8e8a22684b6f92b003e&access_token=8e359af247db3d466ee5fdbce2b841bcc180d457&keymatch=',
            contact:{
                mailTo: 'amiteshhh.nitk@gmail.com;',// multiple address to be added as array. e.g ['a@mail.com', 'b@mail.com']
                signature: '',
                gitHubIssueLink: 'https://github.com/amiteshhh/votepad/issues/new'
            }
        });

})();
